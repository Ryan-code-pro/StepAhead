import React, { useState, useEffect } from 'react';
import { AppTab, StockQuote, NewsArticle, PredictionResult, InvestmentAdvice, PortfolioPosition, ChartDataPoint } from './types';
import { INITIAL_STOCKS, INITIAL_NEWS, generateHistoricalChartData, generateDefaultPrediction } from './data/mockData';
import { OpeningLandingPage } from './components/OpeningLandingPage';
import { NavigationHeader } from './components/NavigationHeader';
import { StockMarketPlatform } from './components/StockMarketPlatform';
import { MarketNewsSection } from './components/MarketNewsSection';
import { PredictionHubSection } from './components/PredictionHubSection';
import { PortfolioModal } from './components/PortfolioModal';

export default function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('market');

  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(INITIAL_NEWS);

  const [selectedStock, setSelectedStock] = useState<StockQuote>(INITIAL_STOCKS[0]);
  const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult>(generateDefaultPrediction(INITIAL_STOCKS[0]));
  const [investmentAdvice, setInvestmentAdvice] = useState<InvestmentAdvice | null>(null);

  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Portfolio State
  const [userCashBalance, setUserCashBalance] = useState<number>(10000.00);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false);

  const [initialNewsTicker, setInitialNewsTicker] = useState<string>('');

  // Fetch stocks & news from API or fallback
  const fetchLatestMarketData = async () => {
    setIsRefreshing(true);
    try {
      const [stocksRes, newsRes] = await Promise.all([
        fetch('/api/stocks'),
        fetch('/api/news')
      ]);

      if (stocksRes.ok) {
        const data = await stocksRes.json();
        if (data.stocks && data.stocks.length > 0) {
          setStocks(data.stocks);
        }
      }

      if (newsRes.ok) {
        const data = await newsRes.json();
        if (data.news && data.news.length > 0) {
          setNewsArticles(data.news);
        }
      }
    } catch (err) {
      console.warn("Error loading server market data, utilizing offline dataset:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestMarketData();
  }, []);

  // Sync historical chart & prediction whenever selected stock changes
  useEffect(() => {
    setHistoricalData(generateHistoricalChartData(selectedStock.price));
    setPrediction(generateDefaultPrediction(selectedStock));
    // Reset or update advice for new stock
    handleCalculateInvestmentAdvice(selectedStock.ticker, userCashBalance > 0 ? userCashBalance : 10000, 'Balanced');
  }, [selectedStock]);

  // Request AI Prediction from Server
  const handleFetchStockPrediction = async (tickerSymbol: string) => {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: tickerSymbol })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prediction) {
          setPrediction(data.prediction);
        }
      }
    } catch (err) {
      console.warn("Prediction API warning:", err);
    }
  };

  // Request AI Investment Advice ("How much should I invest in this stock?")
  const handleCalculateInvestmentAdvice = async (
    tickerSymbol: string,
    portfolioBudget: number,
    riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive'
  ) => {
    setIsLoadingAdvice(true);
    try {
      const res = await fetch('/api/investment-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: tickerSymbol,
          portfolioBudget,
          riskTolerance
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setInvestmentAdvice(data);
          return;
        }
      }
    } catch (err) {
      console.warn("Investment advice API warning:", err);
    } finally {
      setIsLoadingAdvice(false);
    }

    // Fallback calculation if server endpoint delayed
    const allocPct = riskTolerance === 'Conservative' ? 0.08 : riskTolerance === 'Aggressive' ? 0.25 : 0.15;
    const recommendedAmount = Math.round(portfolioBudget * allocPct);
    const sharesCount = Math.max(1, Math.floor(recommendedAmount / selectedStock.price));
    const actualAmount = Number((sharesCount * selectedStock.price).toFixed(2));

    setInvestmentAdvice({
      ticker: selectedStock.ticker,
      stockName: selectedStock.name,
      currentPrice: selectedStock.price,
      portfolioBudget,
      riskTolerance,
      horizon: 'Medium-Term Growth',
      recommendedAmount: actualAmount,
      percentageOfPortfolio: Number(((actualAmount / portfolioBudget) * 100).toFixed(1)),
      sharesCount,
      stopLossPrice: Number((selectedStock.price * 0.92).toFixed(2)),
      takeProfitTarget: Number((selectedStock.price * 1.25).toFixed(2)),
      riskRating: 'Moderate',
      expectedReturnPercent: '+25.0%',
      rationale: `Allocating $${actualAmount} into ${selectedStock.ticker} balances risk with robust earnings upside.`,
      actionPlan: [
        `Place limit order at current price $${selectedStock.price}`,
        `Set stop loss at $${(selectedStock.price * 0.92).toFixed(2)}`,
        `Set take-profit target at $${(selectedStock.price * 1.25).toFixed(2)}`
      ]
    });
    setIsLoadingAdvice(false);
  };

  const handleSelectStock = (stock: StockQuote) => {
    setSelectedStock(stock);
    handleFetchStockPrediction(stock.ticker);
  };

  // Buy Stock Handler
  const handleBuyStock = (stock: StockQuote, shares: number, price: number) => {
    const totalCost = shares * price;
    if (totalCost > userCashBalance) return;

    setUserCashBalance(prev => prev - totalCost);

    setPositions(prev => {
      const existing = prev.find(p => p.ticker === stock.ticker);
      if (existing) {
        const newShares = existing.shares + shares;
        const newTotalInvested = existing.totalInvested + totalCost;
        const newAvg = newTotalInvested / newShares;
        const currentValue = newShares * stock.price;
        const unrealizedGain = currentValue - newTotalInvested;

        return prev.map(p => p.ticker === stock.ticker ? {
          ...p,
          shares: newShares,
          averageBuyPrice: newAvg,
          totalInvested: newTotalInvested,
          currentValue,
          unrealizedGain,
          unrealizedGainPercent: (unrealizedGain / newTotalInvested) * 100
        } : p);
      } else {
        return [...prev, {
          ticker: stock.ticker,
          name: stock.name,
          shares,
          averageBuyPrice: price,
          totalInvested: totalCost,
          currentValue: totalCost,
          unrealizedGain: 0,
          unrealizedGainPercent: 0
        }];
      }
    });
  };

  // Sell Stock Position Handler
  const handleSellPosition = (ticker: string) => {
    const pos = positions.find(p => p.ticker === ticker);
    if (!pos) return;

    setUserCashBalance(prev => prev + pos.currentValue);
    setPositions(prev => prev.filter(p => p.ticker !== ticker));
  };

  const handleNavigateToNews = (tickerSymbol?: string) => {
    if (tickerSymbol) {
      setInitialNewsTicker(tickerSymbol);
    }
    setActiveTab('news');
  };

  const handleNavigateFromNewsToBuy = (tickerSymbol: string) => {
    const found = stocks.find(s => s.ticker === tickerSymbol);
    if (found) {
      setSelectedStock(found);
    }
    setActiveTab('market');
  };

  if (!hasEnteredApp) {
    return <OpeningLandingPage onEnter={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-[#04060a] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Dynamic Animated Ambient Glowing Color Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Emerald Glow Blob */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] animate-glow-1" />
        {/* Cyan Glow Blob */}
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[150px] animate-glow-2" />
        {/* Indigo / Violet Glow Blob */}
        <div className="absolute bottom-10 left-1/3 w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[160px] animate-glow-3" />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Navigation Header */}
      <div className="relative z-10">
        <NavigationHeader
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          stocks={stocks}
          portfolioBalance={userCashBalance}
          positions={positions}
          onOpenPortfolioModal={() => setIsPortfolioModalOpen(true)}
          onRefreshData={fetchLatestMarketData}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Main View rendering Tab selections */}
      <main className="relative z-10 flex-1 pb-12">
        {activeTab === 'market' && (
          <StockMarketPlatform
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={handleSelectStock}
            historicalData={historicalData}
            prediction={prediction}
            investmentAdvice={investmentAdvice}
            onCalculateInvestmentAdvice={handleCalculateInvestmentAdvice}
            onBuyStock={handleBuyStock}
            isLoadingAdvice={isLoadingAdvice}
            userCashBalance={userCashBalance}
            onNavigateToNews={handleNavigateToNews}
          />
        )}

        {activeTab === 'news' && (
          <MarketNewsSection
            newsArticles={newsArticles}
            onSelectTickerForTrading={handleNavigateFromNewsToBuy}
            initialFilterTicker={initialNewsTicker}
          />
        )}

        {activeTab === 'prediction-hub' && (
          <PredictionHubSection
            stocks={stocks}
            selectedStock={selectedStock}
            prediction={prediction}
            onSelectStock={handleSelectStock}
            onNavigateToBuy={(st) => {
              setSelectedStock(st);
              setActiveTab('market');
            }}
          />
        )}
      </main>

      {/* Portfolio Modal Drawer */}
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        positions={positions}
        cashBalance={userCashBalance}
        onSellPosition={handleSellPosition}
        onAddDemoFunds={() => setUserCashBalance(prev => prev + 5000)}
      />

    </div>
  );
}
