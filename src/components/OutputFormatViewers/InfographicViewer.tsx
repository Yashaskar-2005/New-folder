import React, { useState } from 'react';
import { BarChart3, TrendingUp, Palette, Layers, Copy, Check, Info } from 'lucide-react';
import { StructuredOutputItem } from '../../types';

interface Props {
  output: StructuredOutputItem;
}

export const InfographicViewer: React.FC<Props> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const data = output.structured_data || {};
  
  const metrics = data.key_metrics || [];
  const sections = data.sections || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Infographic Visual Blueprint & Copy Architecture</h3>
            <p className="text-xs text-slate-400">Statistical extraction, visual wireframe layout, and copy sections</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-emerald-900/30 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Blueprint' : 'Copy Blueprint Markdown'}
        </button>
      </div>

      {/* Main Blueprint Canvas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {/* Banner Section */}
        <div className="text-center p-6 bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-950 border border-emerald-800/40 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1 inline-block">
            INFOGRAPHIC HEADER
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
            {data.headline || output.title}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {data.subheadline || 'Autonomous Content Transformation Paradigm'}
          </p>
          {data.color_palette && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-emerald-400" /> Palette:
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {data.color_palette}
              </span>
            </div>
          )}
        </div>

        {/* 4 Statistical Highlight Cards */}
        {metrics.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Key Quantitative Callouts
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((m: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-center hover:border-emerald-700/50 transition-all">
                  <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono tracking-tight mb-1">
                    {m.stat}
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">{m.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{m.context}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 Modular Section Blocks */}
        {sections.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-400" /> Visual Layout Sections
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((sec: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-mono">
                        {sec.section_number || idx + 1}
                      </span>
                      {sec.section_title}
                    </span>
                    {sec.icon && (
                      <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                        Icon: {sec.icon}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1.5 mt-2">
                    {(sec.bullet_points || []).map((pt: string, pIdx: number) => (
                      <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
