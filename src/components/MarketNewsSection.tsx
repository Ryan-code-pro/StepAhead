import React, { useState } from 'react';
import { NewsArticle, StockRegion, StockGenre, NewsSentiment } from '../types';
import { Search, Globe, Filter, Newspaper, TrendingUp, TrendingDown, Clock, ArrowUpRight } from 'lucide-react';

interface MarketNewsSectionProps {
  newsArticles: NewsArticle[];
  onSelectTickerForTrading: (ticker: string) => void;
  initialFilterTicker?: string;
}

export const MarketNewsSection: React.FC<MarketNewsSectionProps> = ({
  newsArticles,
  onSelectTickerForTrading,
  initialFilterTicker
}) => {
  const [selectedRegion, setSelectedRegion] = useState<StockRegion>('All');
  const [selectedGenre, setSelectedGenre] = useState<StockGenre>('All');
  const [selectedSentiment, setSelectedSentiment] = useState<NewsSentiment>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialFilterTicker || '');

  // Filter Articles
  const filteredArticles = newsArticles.filter(art => {
    const matchesRegion = selectedRegion === 'All' || art.region === selectedRegion;
    const matchesGenre = selectedGenre === 'All' || art.genre === selectedGenre;
    const matchesSentiment = selectedSentiment === 'All' || art.sentiment === selectedSentiment;
    const matchesSearch = searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.relatedTickers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesGenre && matchesSentiment && matchesSearch;
  });

  // Sentiment ratio calculations
  const totalCount = newsArticles.length;
  const bullishCount = newsArticles.filter(a => a.sentiment === 'BULLISH').length;
  const bearishCount = newsArticles.filter(a => a.sentiment === 'BEARISH').length;
  const bullishPct = Math.round((bullishCount / totalCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="border-b border-neutral-900/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono tracking-widest uppercase font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Newspaper className="w-3.5 h-3.5" />
            <span>FINANCIAL INTELLIGENCE DISPATCH</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Real-Time Market News Desk</h1>
          <p className="text-xs text-neutral-400 max-w-xl">
            Live international financial headlines synthesized for sentiment, sector momentum, and trade triggers.
          </p>
        </div>

        {/* Sentiment Meter Gauge */}
        <div className="bg-black/80 p-5 rounded-2xl border border-neutral-800/80 min-w-[280px] shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono mb-2.5">
            <span className="text-neutral-400 font-extrabold">Global Sentiment</span>
            <span className="text-emerald-400 font-black">{bullishPct}% Bullish</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden flex border border-neutral-800">
            <div className="h-full bg-emerald-400 shadow-[0_0_12px_#10b981]" style={{ width: `${bullishPct}%` }} />
            <div className="h-full bg-rose-500" style={{ width: `${100 - bullishPct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold text-neutral-400 mt-2.5">
            <span className="text-emerald-400">Bullish ({bullishCount})</span>
            <span className="text-rose-400">Bearish ({bearishCount})</span>
          </div>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="border-b border-neutral-900/80 pb-6 space-y-4">
        
        {/* Row 1: Region & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase mr-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Region:
            </span>
            {(['All', 'US', 'Europe', 'Asia', 'Global'] as StockRegion[]).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-emerald-400 text-black shadow-[0_0_18px_rgba(16,185,129,0.4)]'
                    : 'bg-black/60 border border-neutral-800/80 text-neutral-400 hover:text-white'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news headline, ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/80 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* Row 2: Genre & Sentiment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-900/60">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Sector:
            </span>
            {(['All', 'Tech & AI', 'Semiconductors', 'EV & Auto', 'Macroeconomics', 'Crypto & Web3', 'E-Commerce', 'Finance'] as StockGenre[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-neutral-900 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-black/50 border border-neutral-900 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-mono font-extrabold text-neutral-400 uppercase mr-1">Sentiment:</span>
            {(['All', 'BULLISH', 'BEARISH', 'NEUTRAL'] as NewsSentiment[]).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={`px-3.5 py-1 rounded-lg text-xs font-mono font-extrabold transition-all cursor-pointer ${
                  selectedSentiment === s
                    ? 'bg-neutral-900 text-white border border-neutral-700 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ARTICLES GRID IN SCROLLABLE SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono font-extrabold text-neutral-400 px-1 uppercase tracking-wider">
          <span>MATCHING DISPATCHES ({filteredArticles.length})</span>
          <span className="text-emerald-400">SCROLLABLE NEWS FEED</span>
        </div>

        <div className="max-h-[720px] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-black/60 border border-neutral-900 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all group backdrop-blur-sm"
              >
                <div className="space-y-3">
                  {/* Badges bar */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-neutral-400 font-bold text-[10px] border border-neutral-800">
                        {article.region}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-neutral-300 border border-neutral-800 text-[10px] font-bold">
                        {article.genre}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black flex items-center gap-1 ${
                      article.sentiment === 'BULLISH'
                        ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : article.sentiment === 'BEARISH'
                        ? 'text-rose-400'
                        : 'text-neutral-400'
                    }`}>
                      {article.sentiment === 'BULLISH' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {article.sentiment}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-extrabold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                    {article.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-900/80">
                  {/* Source & Timestamp */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span className="font-bold text-neutral-300">{article.source}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {article.timestamp}
                    </span>
                  </div>

                  {/* Related Tickers with Quick Trading Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold">Impacted:</span>
                      {article.relatedTickers.map((t) => (
                        <button
                          key={t}
                          onClick={() => onSelectTickerForTrading(t)}
                          className="px-2.5 py-1 rounded-lg bg-black border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 text-xs font-black font-mono transition-all flex items-center gap-0.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        >
                          <span>${t}</span>
                          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        </button>
                      ))}
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-neutral-400 border border-neutral-900 font-extrabold">
                      Impact {article.impactScore}/10
                    </span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs font-mono bg-black/60 rounded-2xl border border-neutral-900">
          No news articles match your filter parameters.
        </div>
      )}


    </div>
  );
};

