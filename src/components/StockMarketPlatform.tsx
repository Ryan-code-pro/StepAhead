import React, { useState } from 'react';
import { StockQuote, StockRegion, StockGenre, PredictionResult, InvestmentAdvice, ChartDataPoint } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Search, DollarSign, TrendingUp, TrendingDown, ChevronRight, ShieldAlert, Target, CheckCircle2, ShoppingCart, Calculator } from 'lucide-react';

interface StockMarketPlatformProps {
  stocks: StockQuote[];
  selectedStock: StockQuote;
  onSelectStock: (stock: StockQuote) => void;
  historicalData: ChartDataPoint[];
  prediction: PredictionResult;
  investmentAdvice: InvestmentAdvice | null;
  onCalculateInvestmentAdvice: (ticker: string, budget: number, risk: 'Conservative' | 'Balanced' | 'Aggressive') => void;
  onBuyStock: (stock: StockQuote, shares: number, price: number) => void;
  isLoadingAdvice: boolean;
  userCashBalance: number;
  onNavigateToNews: (tickerSymbol?: string) => void;
}

export const StockMarketPlatform: React.FC<StockMarketPlatformProps> = ({
  stocks,
  selectedStock,
  onSelectStock,
  historicalData,
  prediction,
  investmentAdvice,
  onCalculateInvestmentAdvice,
  onBuyStock,
  isLoadingAdvice,
  userCashBalance,
  onNavigateToNews
}) => {
  const [selectedRegion, setSelectedRegion] = useState<StockRegion>('All');
  const [selectedGenre, setSelectedGenre] = useState<StockGenre>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Position Advisor inputs
  const [portfolioBudget, setPortfolioBudget] = useState<number>(userCashBalance > 0 ? userCashBalance : 10000);
  const [riskProfile, setRiskProfile] = useState<'Conservative' | 'Balanced' | 'Aggressive'>('Balanced');
  const [tradeSuccessToast, setTradeSuccessToast] = useState<string | null>(null);

  // Filter logic
  const filteredStocks = stocks.filter(stock => {
    const matchesRegion = selectedRegion === 'All' || stock.region === selectedRegion;
    const matchesGenre = selectedGenre === 'All' || stock.genre === selectedGenre;
    const matchesSearch = searchQuery === '' ||
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesGenre && matchesSearch;
  });

  // Top UP vs DOWN prediction counts
  const upPredictions = stocks.filter(s => s.predictionDirection === 'UP');
  const downPredictions = stocks.filter(s => s.predictionDirection === 'DOWN');

  const handleRunAdviceCalculation = () => {
    onCalculateInvestmentAdvice(selectedStock.ticker, portfolioBudget, riskProfile);
  };

  const handleExecuteTrade = () => {
    if (!investmentAdvice) return;
    const sharesToBuy = investmentAdvice.sharesCount;
    const totalCost = sharesToBuy * selectedStock.price;

    if (totalCost > userCashBalance) {
      alert(`Insufficient cash balance ($${userCashBalance.toFixed(2)} available) for this $${totalCost.toFixed(2)} purchase.`);
      return;
    }

    onBuyStock(selectedStock, sharesToBuy, selectedStock.price);
    setTradeSuccessToast(`Purchased ${sharesToBuy} shares of ${selectedStock.ticker} for $${totalCost.toFixed(2)}`);
    setTimeout(() => setTradeSuccessToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Toast Notification */}
      {tradeSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-black font-semibold px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-neutral-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-mono">{tradeSuccessToast}</span>
        </div>
      )}

      {/* 1. AI PREDICTION BAR */}
      <section className="border-b border-neutral-900/80 pb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] animate-ping" />
              <span className="text-[11px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest">
                QUANT RADAR SIGNALS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Market Trajectory Radar</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Algorithmic forecast metrics synthesized from volume and sentiment momentum.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-2 font-extrabold">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{upPredictions.length} UP SIGNALS</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)] flex items-center gap-2 font-extrabold">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>{downPredictions.length} DOWN SIGNALS</span>
            </div>
          </div>
        </div>

        {/* Prediction Cards horizontal grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stocks.slice(0, 4).map((st) => (
            <div
              key={st.ticker}
              onClick={() => onSelectStock(st)}
              className={`p-5 rounded-2xl transition-all cursor-pointer ${
                selectedStock.ticker === st.ticker
                  ? 'bg-black/90 border border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-[1.02]'
                  : 'bg-black/40 border border-neutral-900/80 hover:border-emerald-500/30 hover:bg-black/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-lg tracking-tight">{st.ticker}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 font-bold">{st.region}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold flex items-center gap-1 ${
                  st.predictionDirection === 'UP' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'text-rose-400'
                }`}>
                  {st.predictionDirection === 'UP' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {st.predictionConfidence}%
                </span>
              </div>

              <div className="text-xs text-neutral-400 truncate mb-4 font-medium">{st.name}</div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-900/80 text-xs font-mono">
                <div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase">Current</div>
                  <div className="font-extrabold text-white text-sm">${st.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">1Y Target</div>
                  <div className="font-extrabold text-emerald-400 text-sm drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">${st.target1Y.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. REGION & GENRE FILTERS + SEARCH BAR */}
      <div className="border-b border-neutral-900/80 pb-6 space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Region Tabs Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase mr-1">Region:</span>
            {(['All', 'US', 'Europe', 'Asia', 'Global'] as StockRegion[]).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-emerald-400 text-black shadow-[0_0_18px_rgba(16,185,129,0.4)]'
                    : 'bg-black/60 border border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/80 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* Genre / Sector Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-neutral-900/60">
          <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase mr-1">Sector:</span>
          {(['All', 'Tech & AI', 'Semiconductors', 'EV & Auto', 'Cloud & Software', 'E-Commerce', 'Crypto & Web3', 'Finance'] as StockGenre[]).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedGenre === g
                  ? 'bg-neutral-900 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'bg-black/50 border border-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        
        {/* Left Column: Stock List Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-neutral-500 px-1">
            <span>AVAILABLE ASSETS ({filteredStocks.length})</span>
            <span className="text-emerald-400">SELECT TO ANALYZE</span>
          </div>

          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredStocks.map((st) => {
              const isSelected = selectedStock.ticker === st.ticker;
              return (
                <div
                  key={st.ticker}
                  onClick={() => onSelectStock(st)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'bg-black border-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base tracking-tight">{st.ticker}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black text-neutral-400 border border-neutral-800">{st.region}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">${st.price.toFixed(2)}</span>
                  </div>

                  <div className="text-xs text-neutral-400 truncate mb-2">{st.name}</div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-neutral-900">
                    <span className={`font-bold ${st.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {st.changePercent >= 0 ? '+' : ''}{st.changePercent}%
                    </span>

                    <span className="px-2 py-0.5 rounded bg-black text-neutral-400 text-[10px] border border-neutral-900">
                      {st.genre}
                    </span>

                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      AI Score: {st.aiScore}/10
                      <ChevronRight className="w-3 h-3 text-neutral-500" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail & Investment Advisor (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Selected Stock Banner Header - Seamless Matte Black with Vibrant Glow Headers */}
          <div className="border border-neutral-900 rounded-2xl p-6 space-y-6 bg-black relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-white tracking-tight">{selectedStock.ticker}</h1>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-neutral-900 text-neutral-200 border border-neutral-800">{selectedStock.name}</span>
                  <span className="px-3 py-1 rounded-md text-xs font-mono bg-black text-emerald-400 border border-emerald-500/30">{selectedStock.region}</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1.5 font-medium">{selectedStock.sector} • {selectedStock.genre}</div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <div className="text-3xl font-extrabold text-white">${selectedStock.price.toFixed(2)}</div>
                <div className={`text-xs font-bold mt-0.5 ${selectedStock.changePercent >= 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-rose-400'}`}>
                  {selectedStock.changePercent >= 0 ? '▲' : '▼'} ${Math.abs(selectedStock.change).toFixed(2)} ({selectedStock.changePercent}%)
                </div>
              </div>
            </div>

            {/* Interactive Price Chart with Vibrant Emerald Glow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="text-neutral-300 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  HISTORICAL TRAJECTORY & AI FORECAST
                </span>
                <span>1Y FORECAST TARGET: <strong className="text-emerald-400 text-sm font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]">${selectedStock.target1Y.toFixed(2)}</strong></span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#171717" />
                    <XAxis dataKey="date" stroke="#525252" fontSize={11} tickLine={false} />
                    <YAxis stroke="#525252" fontSize={11} domain={['auto', 'auto']} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#000000', borderColor: '#10b981', borderRadius: '10px', color: '#fff', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
                      formatter={(val: any) => [`$${val}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="historical" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#priceGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stock Key Financial Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-900 text-xs font-mono">
              <div className="bg-black p-3.5 rounded-xl border border-neutral-900">
                <div className="text-neutral-500 font-semibold">Market Cap</div>
                <div className="font-bold text-white mt-1 text-sm">{selectedStock.marketCap}</div>
              </div>
              <div className="bg-black p-3.5 rounded-xl border border-neutral-900">
                <div className="text-neutral-500 font-semibold">P/E Ratio</div>
                <div className="font-bold text-white mt-1 text-sm">{selectedStock.peRatio > 0 ? selectedStock.peRatio : 'N/A'}</div>
              </div>
              <div className="bg-black p-3.5 rounded-xl border border-neutral-900">
                <div className="text-neutral-500 font-semibold">52W Range</div>
                <div className="font-bold text-white mt-1 text-sm">${selectedStock.low52} - ${selectedStock.high52}</div>
              </div>
              <div className="bg-black p-3.5 rounded-xl border border-neutral-900">
                <div className="text-neutral-500 font-semibold">24H Volume</div>
                <div className="font-bold text-white mt-1 text-sm">{selectedStock.volume}</div>
              </div>
            </div>

          </div>

          {/* 4. AI SMART POSITION CALCULATOR */}
          <div className="border border-neutral-900 rounded-2xl p-6 space-y-6 bg-black relative">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-black border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Position Size Allocation Calculator</h2>
                  <p className="text-xs text-neutral-400">Determines exact dollar & share allocation for {selectedStock.ticker}.</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToNews(selectedStock.ticker)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-bold underline cursor-pointer"
              >
                News for {selectedStock.ticker} →
              </button>
            </div>

            {/* Parameter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-400 mb-1.5">
                  Available Capital / Budget ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={portfolioBudget}
                    onChange={(e) => setPortfolioBudget(Math.max(100, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-black border border-neutral-800 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-400 mb-1.5">
                  Risk Profile
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Conservative', 'Balanced', 'Aggressive'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRiskProfile(r)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        riskProfile === r
                          ? 'bg-emerald-400 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-black border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunAdviceCalculation}
                disabled={isLoadingAdvice}
                className="px-6 py-3 rounded-xl bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase hover:bg-emerald-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
              >
                <span>{isLoadingAdvice ? 'CALCULATING QUANT ADVICE...' : `CALCULATE ALLOCATION FOR ${selectedStock.ticker}`}</span>
              </button>
            </div>

            {/* Render AI Recommendation Results */}
            {investmentAdvice ? (
              <div className="bg-black border border-neutral-900 rounded-xl p-5 space-y-5">
                
                {/* Highlight Result Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-black border border-neutral-800 p-4 rounded-xl">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Recommended Allocation</div>
                    <div className="text-2xl font-black font-mono text-white mt-1">
                      ${investmentAdvice.recommendedAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 font-mono">
                      {investmentAdvice.percentageOfPortfolio}% of portfolio
                    </div>
                  </div>

                  <div className="bg-black border border-neutral-800 p-4 rounded-xl">
                    <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Exact Share Count</div>
                    <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                      {investmentAdvice.sharesCount} Shares
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 font-mono">
                      at ${selectedStock.price.toFixed(2)} / share
                    </div>
                  </div>

                  <div className="bg-black border border-neutral-800 p-4 rounded-xl">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Target Return & Risk</div>
                    <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                      {investmentAdvice.expectedReturnPercent}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 font-mono">
                      Risk Rating: {investmentAdvice.riskRating}
                    </div>
                  </div>
                </div>

                {/* Risk Parameters */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-black p-3.5 rounded-xl border border-neutral-900">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <div>
                      <span className="text-neutral-500">Stop-Loss Exit: </span>
                      <strong className="text-rose-400">${investmentAdvice.stopLossPrice}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="text-neutral-500">Take Profit Target: </span>
                      <strong className="text-emerald-400">${investmentAdvice.takeProfitTarget}</strong>
                    </div>
                  </div>
                </div>

                {/* Rationale & Action Plan */}
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white mb-1">Quantitative Rationale:</h4>
                    <p className="text-neutral-300 leading-relaxed bg-black p-3.5 rounded-xl border border-neutral-900 font-sans">
                      {investmentAdvice.rationale}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">Execution Steps:</h4>
                    <ul className="space-y-1.5 text-neutral-300 font-mono">
                      {investmentAdvice.actionPlan?.map((step, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-black p-2.5 rounded-lg border border-neutral-900">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Execution Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-neutral-400 font-mono">
                    Cash Balance: <strong className="text-white">${userCashBalance.toFixed(2)}</strong>
                  </div>

                  <button
                    onClick={handleExecuteTrade}
                    id="buy-stock-btn"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>BUY {investmentAdvice.sharesCount} SHARES NOW (${(investmentAdvice.sharesCount * selectedStock.price).toFixed(2)})</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-neutral-500 text-xs font-mono bg-black rounded-xl border border-neutral-900">
                Click "CALCULATE ALLOCATION FOR {selectedStock.ticker}" above to view custom position sizing strategy.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

