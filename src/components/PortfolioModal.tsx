import React from 'react';
import { PortfolioPosition } from '../types';
import { Wallet, X, Trash2 } from 'lucide-react';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions: PortfolioPosition[];
  cashBalance: number;
  onSellPosition: (ticker: string) => void;
  onAddDemoFunds: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  positions,
  cashBalance,
  onSellPosition,
  onAddDemoFunds
}) => {
  if (!isOpen) return null;

  const totalInvested = positions.reduce((acc, p) => acc + p.currentValue, 0);
  const totalUnrealizedGain = positions.reduce((acc, p) => acc + p.unrealizedGain, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Simulated Equity Ledger</h2>
              <p className="text-xs text-neutral-400">Real-time allocation and cash balance ledger.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Portfolio Net Worth Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="bg-black p-4 rounded-xl border border-neutral-900">
            <div className="text-neutral-500 uppercase text-[10px]">Available Cash</div>
            <div className="text-lg font-bold text-white mt-1">${cashBalance.toFixed(2)}</div>
            <button
              onClick={onAddDemoFunds}
              className="mt-2 text-[10px] text-neutral-300 font-semibold hover:text-white hover:underline cursor-pointer"
            >
              + Deposit $5,000 Demo Funds
            </button>
          </div>

          <div className="bg-black p-4 rounded-xl border border-neutral-900">
            <div className="text-neutral-500 uppercase text-[10px]">Total Invested</div>
            <div className="text-lg font-bold text-neutral-200 mt-1">${totalInvested.toFixed(2)}</div>
            <div className="text-[10px] text-neutral-500 mt-2">{positions.length} Active Positions</div>
          </div>

          <div className="bg-black p-4 rounded-xl border border-neutral-900">
            <div className="text-neutral-500 uppercase text-[10px]">Unrealized P&L</div>
            <div className={`text-lg font-bold mt-1 ${totalUnrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalUnrealizedGain >= 0 ? '+' : ''}${totalUnrealizedGain.toFixed(2)}
            </div>
            <div className="text-[10px] text-neutral-500 mt-2">Portfolio Delta</div>
          </div>
        </div>

        {/* Positions Table */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono text-neutral-500 uppercase">Active Holdings ({positions.length})</div>

          {positions.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {positions.map((p) => (
                <div
                  key={p.ticker}
                  className="bg-black p-4 rounded-xl border border-neutral-900 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{p.ticker}</div>
                    <div className="text-neutral-500 text-[11px]">{p.shares} shares @ ${p.averageBuyPrice.toFixed(2)}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">${p.currentValue.toFixed(2)}</div>
                    <div className={`text-[11px] ${p.unrealizedGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.unrealizedGain >= 0 ? '+' : ''}${p.unrealizedGain.toFixed(2)} ({p.unrealizedGainPercent.toFixed(1)}%)
                    </div>
                  </div>

                  <button
                    onClick={() => onSellPosition(p.ticker)}
                    title="Liquidate Position"
                    className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-rose-950 hover:text-rose-200 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs font-mono bg-black rounded-xl border border-neutral-900">
              No active stock positions. Select a stock on the platform to execute position allocation.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
