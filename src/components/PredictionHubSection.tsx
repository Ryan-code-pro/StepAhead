import React from 'react';
import { StockQuote, PredictionResult } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PredictionHubSectionProps {
  stocks: StockQuote[];
  selectedStock: StockQuote;
  prediction: PredictionResult;
  onSelectStock: (stock: StockQuote) => void;
  onNavigateToBuy: (stock: StockQuote) => void;
}

export const PredictionHubSection: React.FC<PredictionHubSectionProps> = ({
  stocks,
  selectedStock,
  prediction,
  onSelectStock,
  onNavigateToBuy
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-neutral-900/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono tracking-widest uppercase font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI QUANTITATIVE FORECAST MATRIX</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Predictive Trajectory Radar</h1>
          <p className="text-xs text-neutral-400 max-w-2xl">
            Multi-horizon statistical modeling combining real-time sentiment, technical momentum, and order flow metrics.
          </p>
        </div>

        <button
          onClick={() => onNavigateToBuy(selectedStock)}
          className="px-6 py-3.5 rounded-xl bg-emerald-400 text-black font-black text-xs tracking-wider uppercase hover:bg-emerald-300 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.4)] self-start md:self-auto"
        >
          <span>ALLOCATE CAPITAL IN {selectedStock.ticker}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* STOCKS RANKED BY AI FORECAST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tickers list (5 cols) in Scrollable Container */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-extrabold text-neutral-400 px-1 uppercase tracking-wider">
            <span>TRACKED ASSETS BY MODEL CONFIDENCE</span>
            <span className="text-emerald-400">SCROLL TO VIEW</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {stocks.map((st) => {
              const isSelected = selectedStock.ticker === st.ticker;
              return (
                <div
                  key={st.ticker}
                  onClick={() => onSelectStock(st)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black/90 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'bg-black/40 border-neutral-900 hover:border-neutral-800 hover:bg-black/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-base tracking-tight">{st.ticker}</span>
                      <span className="text-xs text-neutral-400 font-semibold">{st.name}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-black bg-black text-emerald-400 border border-emerald-500/30">
                      {st.predictionConfidence}% Confidence
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-neutral-900/80">
                    <span className="text-neutral-400 font-bold">1Y Target: <strong className="text-emerald-400 font-black">${st.target1Y.toFixed(2)}</strong></span>
                    <span className="text-neutral-300 font-black">AI Rating: {st.aiScore}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Forecast Analysis for Selected Stock (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="border border-neutral-900/90 rounded-2xl p-6 space-y-6 bg-black/70 backdrop-blur-md relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
              <div>
                <div className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-wider">QUANTITATIVE SYNTHESIS</div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{prediction.ticker} Model Forecast</h2>
              </div>

              <div className="text-right">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-black bg-black text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  {prediction.signal}
                </span>
              </div>
            </div>

            {/* Target Price Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
              <div className="bg-black/80 p-4 rounded-xl border border-neutral-900">
                <div className="text-neutral-400 font-extrabold text-[10px] uppercase">1 Month</div>
                <div className="text-base font-black text-white mt-1">${prediction.targetPrice1M}</div>
              </div>
              <div className="bg-black/80 p-4 rounded-xl border border-neutral-900">
                <div className="text-neutral-400 font-extrabold text-[10px] uppercase">3 Months</div>
                <div className="text-base font-black text-white mt-1">${prediction.targetPrice3M}</div>
              </div>
              <div className="bg-black/80 p-4 rounded-xl border border-neutral-900">
                <div className="text-neutral-400 font-extrabold text-[10px] uppercase">6 Months</div>
                <div className="text-base font-black text-white mt-1">${prediction.targetPrice6M}</div>
              </div>
              <div className="bg-black/80 p-4 rounded-xl border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <div className="text-emerald-400 font-extrabold text-[10px] uppercase">1 Year Target</div>
                <div className="text-base font-black text-emerald-400 mt-1">${prediction.targetPrice1Y}</div>
              </div>
            </div>

            {/* Probability Density Distribution */}
            <div className="space-y-2.5">
              <div className="text-xs font-mono font-extrabold text-neutral-300 uppercase">PROBABILITY DISTRIBUTION SCENARIOS</div>
              <div className="w-full h-3 rounded-full bg-black overflow-hidden flex border border-neutral-800">
                <div className="h-full bg-emerald-400 shadow-[0_0_12px_#10b981]" style={{ width: `${prediction.bullishProbability}%` }} />
                <div className="h-full bg-neutral-600" style={{ width: `${prediction.neutralProbability}%` }} />
                <div className="h-full bg-rose-500" style={{ width: `${prediction.bearishProbability}%` }} />
              </div>
              <div className="flex justify-between text-[11px] font-mono font-black text-neutral-300">
                <span className="text-emerald-400">Bullish: {prediction.bullishProbability}%</span>
                <span>Neutral: {prediction.neutralProbability}%</span>
                <span className="text-rose-400">Bearish: {prediction.bearishProbability}%</span>
              </div>
            </div>

            {/* Technical Momentum Indicators */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono bg-black/80 p-4 rounded-xl border border-neutral-900">
              <div>
                <div className="text-neutral-500 font-extrabold text-[10px] uppercase">RSI Indicator</div>
                <div className="font-black text-white text-sm mt-0.5">{prediction.rsi}</div>
              </div>
              <div>
                <div className="text-neutral-500 font-extrabold text-[10px] uppercase">MACD Signal</div>
                <div className="font-black text-emerald-400 text-sm mt-0.5">{prediction.macdSignal}</div>
              </div>
              <div>
                <div className="text-neutral-500 font-extrabold text-[10px] uppercase">Moving Averages</div>
                <div className="font-black text-emerald-400 text-sm mt-0.5">{prediction.movingAverageSignal}</div>
              </div>
            </div>

            {/* Summary Rationale */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-white text-sm">Model Executive Rationale:</h4>
              <p className="text-neutral-300 leading-relaxed bg-black/80 p-4 rounded-xl border border-neutral-900 font-sans">
                {prediction.summary}
              </p>
            </div>

            {/* Catalysts & Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Positive Catalysts:
                </h4>
                <ul className="space-y-1.5 text-neutral-300 font-mono">
                  {prediction.catalysts.map((cat, i) => (
                    <li key={i} className="bg-black/80 p-3 rounded-xl border border-neutral-900 font-medium">
                      • {cat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-rose-400 flex items-center gap-1.5 text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Key Risk Factors:
                </h4>
                <ul className="space-y-1.5 text-neutral-300 font-mono">
                  {prediction.risks.map((r, i) => (
                    <li key={i} className="bg-black/80 p-3 rounded-xl border border-neutral-900 font-medium">
                      • {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

      </div>


    </div>
  );
};
