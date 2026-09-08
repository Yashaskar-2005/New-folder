import React, { useState } from 'react';
import { Briefcase, AlertOctagon, CheckSquare, Copy, Check, FileCheck } from 'lucide-react';
import { StructuredOutputItem } from '../../types';

interface Props {
  output: StructuredOutputItem;
}

export const ExecSummaryViewer: React.FC<Props> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const data = output.structured_data || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const findings = data.key_findings || [];
  const decisions = data.recommended_decisions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">C-Suite Executive Briefing Memo</h3>
            <p className="text-xs text-slate-400">High-level 200-300 word decision briefing for senior leadership</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-amber-900/30 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Briefing' : 'Copy Executive Memo'}
        </button>
      </div>

      {/* Briefing Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 max-w-3xl mx-auto">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CONFIDENTIAL EXECUTIVE BRIEF</span>
            <span className="text-xs font-mono text-slate-400">{data.briefing_date || 'September 2026'}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{data.title || output.title}</h2>
        </div>

        {/* Overview Box */}
        {data.overview && (
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Executive Overview</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{data.overview}</p>
          </div>
        )}

        {/* Strategic Key Findings */}
        {findings.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-400" /> Strategic Key Takeaways
            </h4>
            <div className="space-y-2.5">
              {findings.map((f: string, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-lg flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200 leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Assessment Callout */}
        {data.risk_assessment && (
          <div className="p-4 bg-rose-950/30 border border-rose-900/40 rounded-lg">
            <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" /> Risk & Governance Assessment
            </h4>
            <p className="text-xs text-rose-200 leading-relaxed">{data.risk_assessment}</p>
          </div>
        )}

        {/* Recommended Decisions */}
        {decisions.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Actionable Leadership Directives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {decisions.map((dec: string, idx: number) => (
                <div key={idx} className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold text-sm">✓</span>
                  <span className="text-xs text-slate-300">{dec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
