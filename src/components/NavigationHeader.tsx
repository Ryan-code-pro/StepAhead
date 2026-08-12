import React from 'react';
import { AppTab, StockQuote, PortfolioPosition } from '../types';
import { TrendingUp, Newspaper, Wallet, RefreshCw, Layers } from 'lucide-react';

interface NavigationHeaderProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  stocks: StockQuote[];
  portfolioBalance: number;
  positions: PortfolioPosition[];
  onOpenPortfolioModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onChangeTab,
  stocks,
  portfolioBalance,
  positions,
  onOpenPortfolioModal,
  onRefreshData,
  isRefreshing
}) => {
  const totalInvested = positions.reduce((acc, p) => acc + p.currentValue, 0);
  const totalNetWorth = portfolioBalance + totalInvested;

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-black border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center justify-center font-mono font-bold text-emerald-400 text-[11px] tracking-wider">
              AQ
            </div>
            <span className="text-xs font-mono tracking-[0.25em] text-white uppercase font-bold hidden sm:inline-block">
              AETHER <span className="text-emerald-400">QUANT</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 p-1 bg-black rounded-xl border border-neutral-800/80">
            <button
              id="tab-market"
              onClick={() => onChangeTab('market')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'market'
                  ? 'bg-emerald-400 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Stock Platform</span>
            </button>

            <button
              id="tab-news"
              onClick={() => onChangeTab('news')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-emerald-400 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Market News</span>
            </button>

            <button
              id="tab-prediction-hub"
              onClick={() => onChangeTab('prediction-hub')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'prediction-hub'
                  ? 'bg-emerald-400 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AI Radar</span>
            </button>
          </nav>

          {/* Right Actions: Portfolio Balance & Refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              title="Refresh AI Quotes & News"
              className="p-2 rounded-lg bg-black border border-neutral-800 text-neutral-400 hover:text-white hover:border-emerald-500/50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              onClick={onOpenPortfolioModal}
              id="portfolio-widget-btn"
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-black border border-neutral-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              <div className="hidden sm:block">
                <div className="text-[9px] uppercase font-mono tracking-widest text-neutral-500">Portfolio Net</div>
                <div className="text-xs font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                  ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Live Market Marquee Bar */}
      <div className="bg-black border-t border-neutral-900 py-1.5 px-4 overflow-hidden text-[11px] font-mono">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-ping" />
            LIVE SIGNALS:
          </span>
          {stocks.map((stock) => (
            <div key={stock.ticker} className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-white">{stock.ticker}</span>
              <span className="text-neutral-400">${stock.price.toFixed(2)}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
              </span>
              <span className="text-neutral-500 text-[10px]">
                AI: {stock.predictionDirection} ({stock.predictionConfidence}%)
              </span>
              <span className="text-neutral-800">|</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

