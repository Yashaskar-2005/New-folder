import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Copy, Check, Server, FileText } from 'lucide-react';
import { StructuredOutputItem } from '../../types';

interface Props {
  output: StructuredOutputItem;
}

export const AdvisoryViewer: React.FC<Props> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const data = output.structured_data || {};
  
  const severity = (data.severity || 'HIGH').toUpperCase();
  const advisoryId = data.advisory_id || 'ADV-2026-0891';
  const affectedSystems = data.affected_systems || ['API Gateway', 'Operational Infrastructure', 'Database Clusters'];
  const mitigations = data.mitigation_steps || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950/60 text-rose-400 border-rose-800 animate-pulse';
      case 'HIGH':
        return 'bg-amber-950/60 text-amber-400 border-amber-800';
      case 'MEDIUM':
        return 'bg-yellow-950/60 text-yellow-400 border-yellow-800';
      default:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-base">Operational / Security Advisory</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getSeverityBadge()}`}>
                {severity}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{advisoryId} • Formal Technical Directive</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all border border-slate-700 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Advisory' : 'Copy Advisory Markdown'}
        </button>
      </div>

      {/* Advisory Document Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {/* Top Metadata Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Target Audience</span>
            <span className="text-sm font-medium text-slate-200">{data.target_audience || 'DevOps & Security Teams'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Severity Classification</span>
            <span className="text-sm font-bold text-rose-400">{severity} PRIORITY</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Verification Status</span>
            <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Source Grounded
            </span>
          </div>
        </div>

        {/* Affected Systems */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-400" /> Affected Systems & Scope
          </h4>
          <div className="flex flex-wrap gap-2">
            {affectedSystems.map((sys: string, idx: number) => (
              <span key={idx} className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono">
                {sys}
              </span>
            ))}
          </div>
        </div>

        {/* Executive Overview */}
        {data.executive_summary && (
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{data.executive_summary}</p>
          </div>
        )}

        {/* Required Mitigations Table */}
        {mitigations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Action Items & Remediation Directives
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Step</th>
                    <th className="px-4 py-3">Directive / Action</th>
                    <th className="px-4 py-3 rounded-r-lg">Responsible Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {mitigations.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                        #{item.step_number || i + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {item.action || item}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.owner || 'SecOps'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Raw Markdown Accordion/View */}
        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" /> Formatted Advisory Report
          </h4>
          <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800/80 max-h-80 overflow-y-auto">
            {output.content_markdown}
          </div>
        </div>
      </div>
    </div>
  );
};
