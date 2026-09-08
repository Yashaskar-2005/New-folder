import React, { useEffect, useState } from 'react';
import { X, BarChart2, Activity, Zap, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { AnalyticsSummary } from '../types';
import { fetchAnalytics } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetchAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">System Telemetry & Analytics</h3>
              <p className="text-xs text-slate-400">Real-time throughput, format frequency, and latency metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading || !data ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs">Compiling telemetry metrics...</span>
            </div>
          ) : (
            <>
              {/* 4 Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <div className="text-2xl font-black text-indigo-400 font-mono">
                    {data.total_transformations}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Transformations</div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {data.total_words_processed.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Words Processed</div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {data.total_deliverables_generated}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Deliverables Out</div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {data.avg_latency_seconds}s
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Avg Latency</div>
                </div>
              </div>

              {/* Format Breakdown Distribution */}
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" /> Format Popularity Breakdown
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.format_distribution).map(([fmt, count]) => {
                    const maxVal = Math.max(...Object.values(data.format_distribution), 1);
                    const pct = Math.round((count / maxVal) * 100);

                    return (
                      <div key={fmt} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-300 capitalize">{fmt.replace('_', ' ')}</span>
                          <span className="text-slate-400 font-mono">{count} generated</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Audience Distribution */}
              <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" /> Audience Distribution
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(data.audience_distribution).map(([aud, count]) => (
                    <div key={aud} className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg">
                      <span className="text-xs text-slate-400 capitalize block">{aud.replace('_', ' ')}</span>
                      <span className="text-lg font-bold text-white font-mono">{count} jobs</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
