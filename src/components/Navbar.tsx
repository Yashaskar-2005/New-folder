import React from 'react';
import { Sparkles, History, BarChart2, GraduationCap, Settings, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  onOpenHistory: () => void;
  onOpenAnalytics: () => void;
  onOpenDocs: () => void;
  onOpenSettings: () => void;
  activeModel: string;
  hasCustomKey: boolean;
}

export const Navbar: React.FC<Props> = ({
  onOpenHistory,
  onOpenAnalytics,
  onOpenDocs,
  onOpenSettings,
  activeModel,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight">
                ContentForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Gen AI Content Repurposing Engine</p>
          </div>
        </div>

        {/* Center: Live Engine Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-medium">Model:</span>
          <span className="text-cyan-400 font-mono font-medium">{activeModel}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {hasCustomKey ? 'API Key Active' : 'Offline Viva Ready'}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            title="Transformation History"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            title="Telemetry & Analytics"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          {/* College Viva Guide Button */}
          <button
            onClick={onOpenDocs}
            title="Final Year Project & Viva Guide"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/60 rounded-lg transition-all"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Viva Guide</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Configure API Keys & Models"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
