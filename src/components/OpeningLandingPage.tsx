import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, BarChart3, Globe2, ChevronRight, Zap } from 'lucide-react';

interface OpeningLandingPageProps {
  onEnter: () => void;
}

export const OpeningLandingPage: React.FC<OpeningLandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none font-sans">
      
      {/* Background Subtle Neon Radial Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hairline Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_80%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 border-b border-neutral-900/80 pb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center font-mono font-bold text-emerald-400 text-xs tracking-wider">
            AQ
          </div>
          <span className="text-xs font-mono tracking-[0.25em] text-white uppercase font-bold">
            AETHER <span className="text-emerald-400">QUANT</span>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
          <span className="tracking-widest uppercase font-semibold text-neutral-300">GEMINI 3.6 ENGINE</span>
        </div>
      </motion.div>

      {/* Center Hero Content */}
      <div className="max-w-5xl mx-auto text-center space-y-8 my-auto z-10 py-12">
        
        {/* Subtle Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-emerald-400 text-[11px] font-mono tracking-[0.2em] uppercase"
        >
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>NEXT-GEN QUANTITATIVE INTELLIGENCE</span>
        </motion.div>

        {/* Dynamic Heading with Dramatic Hierarchy */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02]"
        >
          Predict Trends. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200">
            Allocate Capital.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Real-time global news synthesis across regions and sectors, algorithmic price forecasting, and quantitative position size calculations.
        </motion.p>

        {/* Embedded Feature Items - Integrated into Grid without Box Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900 border-y border-neutral-900 py-6 text-left max-w-4xl mx-auto my-6"
        >
          <div className="p-4 space-y-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Global News Desk</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Real-time macro synthesis across US, Europe, Asia, and sector genres.</p>
          </div>

          <div className="p-4 space-y-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">AI Forecast Radar</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Algorithmic probability indicators highlighting high-conviction signals.</p>
          </div>

          <div className="p-4 space-y-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Position Sizing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">Exact dollar allocation and stop-loss targets tailored to your cash balance.</p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="pt-2"
        >
          <button
            onClick={onEnter}
            id="enter-platform-btn"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-400 text-black font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-emerald-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <span>LAUNCH PLATFORM</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="max-w-7xl mx-auto w-full text-[11px] text-neutral-500 font-mono z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-900/80 pt-6"
      >
        <span>AETHER QUANT ENGINE</span>
        <span className="text-neutral-400">MATTE BLACK FINTECH ARCHITECTURE</span>
        <span className="text-emerald-400">GEMINI 3.6 FLASH</span>
      </motion.div>

    </div>
  );
};


