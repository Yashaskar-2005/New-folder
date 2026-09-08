import React, { useEffect, useState } from 'react';
import { X, History, Clock, FileText, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { JobListItem, TransformResponse } from '../types';
import { fetchHistory, fetchJobDetail, deleteJob } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectJob: (job: TransformResponse) => void;
}

export const HistoryModal: React.FC<Props> = ({ isOpen, onClose, onSelectJob }) => {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchHistory();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setRestoringId(id);
      const fullJob = await fetchJobDetail(id);
      onSelectJob(fullJob);
      onClose();
    } catch (err) {
      alert('Failed to load past job details');
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this past job record?')) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Transformation History</h3>
              <p className="text-xs text-slate-400">Database-persisted past generation sessions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Fetching past records...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">No transformation history found yet.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleRestore(job.id)}
                className="p-4 bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 rounded-xl cursor-pointer hover:bg-indigo-950/20 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {job.source_title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {job.source_type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <FileText className="w-3 h-3 text-indigo-400" /> {job.source_word_count} words
                    </span>
                    <span>•</span>
                    <span className="text-cyan-400 font-medium">{job.outputs_count} outputs</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {new Date(job.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, job.id)}
                    title="Delete record"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    disabled={restoringId === job.id}
                    className="px-3 py-1.5 bg-indigo-600/20 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    {restoringId === job.id ? 'Loading...' : 'Restore'}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
