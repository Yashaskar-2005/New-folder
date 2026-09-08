import React from 'react';
import { X, GraduationCap, CheckCircle2, BookOpen, Layers, HelpCircle, Code, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Final Year Project & Viva Voce Guide</h3>
              <p className="text-xs text-slate-400">Technical architecture and examiner evaluation reference</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed flex-1">
          {/* Summary Box */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <BookOpen className="w-4 h-4" /> One-Line Project Definition
            </div>
            <p className="text-slate-200">
              An autonomous full-stack <strong>Content Repurposing Engine</strong> that ingests a single source document (PDF, DOCX, TXT, or prompt) and concurrently synthesizes <strong>7 channel-tailored deliverables</strong> using Generative AI (Google Gemini & Offline Contextual Synthesizer).
            </p>
          </div>

          {/* 3 Layers Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> 3-Tier Technical Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400 text-xs block">1. Presentation Tier</span>
                <p className="text-[11px] text-slate-400">
                  React 19 + TypeScript + Tailwind CSS with dedicated viewers for each of the 7 formats.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-cyan-400 text-xs block">2. Orchestration Tier</span>
                <p className="text-[11px] text-slate-400">
                  FastAPI backend with PyPDF/Docx parsers, structured prompt templates, and PPTX slide generator.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400 text-xs block">3. Persistence & AI</span>
                <p className="text-[11px] text-slate-400">
                  SQLAlchemy database with SQLite/Postgres + Google Gemini API & Offline Viva Synthesizer.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Viva Q&A */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Key Viva Questions & Answers
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                <strong className="text-white text-xs block">Q: Why not just use ChatGPT directly?</strong>
                <p className="text-[11px] text-slate-400">
                  A ChatGPT interface is non-deterministic and requires manual prompting per format. Our system automates file ingestion, enforces strict JSON schemas (e.g. character count limits for tweets and timing for video scripts), persists history, and exports production-ready `.pptx` presentations.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                <strong className="text-white text-xs block">Q: How do you prevent hallucinations in critical advisories?</strong>
                <p className="text-[11px] text-slate-400">
                  We enforce source grounding in the system prompts, use low temperature decoding (0.2–0.4), and constrain the output to strict structural fields (Severity, Affected Systems, Mitigations).
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                <strong className="text-white text-xs block">Q: What happens if network fails during the external evaluation?</strong>
                <p className="text-[11px] text-slate-400">
                  We engineered an Intelligent Offline Synthesizer that extracts lead sentences, entities, and numbers from the actual input to produce realistic, context-specific transformations without any external API dependency.
                </p>
              </div>
            </div>
          </div>

          {/* Documentation File Pointers */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="font-semibold text-slate-300 text-xs block">Complete Project Deliverables in Workspace:</span>
            <ul className="space-y-1 text-[11px] text-indigo-400 font-mono">
              <li>• docs/FINAL_YEAR_PROJECT_REPORT.md (Full 6-chapter thesis template)</li>
              <li>• docs/VIVA_QUESTIONS_AND_ANSWERS.md (Top 25 Viva Q&As)</li>
              <li>• docs/ARCHITECTURE_DIAGRAMS.md (3-tier & sequence diagrams)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
