import React from 'react';
import { 
  MessageSquare, 
  ShieldAlert, 
  Clapperboard, 
  BarChart3, 
  Briefcase, 
  Presentation,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Linkedin } from './LinkedinIcon';
import { OutputFormatType } from '../types';

interface FormatConfig {
  id: OutputFormatType;
  title: string;
  category: 'Social' | 'Enterprise' | 'Media' | 'Presentation';
  desc: string;
  icon: React.ElementType;
  colorClass: string;
}

export const FORMAT_OPTIONS: FormatConfig[] = [
  {
    id: 'linkedin',
    title: 'LinkedIn Post',
    category: 'Social',
    desc: 'Thought leadership with hook, body takeaways, CTA & hashtags.',
    icon: Linkedin,
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'twitter',
    title: 'Twitter / X Thread',
    category: 'Social',
    desc: 'Numbered tweets (1/N) constrained to <280 chars each.',
    icon: MessageSquare,
    colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
  },
  {
    id: 'advisory',
    title: 'Security Advisory',
    category: 'Enterprise',
    desc: 'Incident report with Severity, Scope, Impact & Mitigations.',
    icon: ShieldAlert,
    colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  },
  {
    id: 'video_script',
    title: 'Video Storyboard',
    category: 'Media',
    desc: 'Scene-by-scene timing, camera cues, voiceover & captions.',
    icon: Clapperboard,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'infographic',
    title: 'Infographic Blueprint',
    category: 'Media',
    desc: 'Key statistical callouts, 4 modular layout cards & iconography.',
    icon: BarChart3,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'exec_summary',
    title: 'Executive Summary',
    category: 'Enterprise',
    desc: '200-word C-Suite briefing memo with risks & decision points.',
    icon: Briefcase,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'presentation',
    title: 'Slide Deck (.pptx)',
    category: 'Presentation',
    desc: 'Structured slides with bullet points, speaker notes & visuals.',
    icon: Presentation,
    colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  }
];

interface Props {
  selectedFormats: OutputFormatType[];
  onToggleFormat: (format: OutputFormatType) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const OutputSelector: React.FC<Props> = ({
  selectedFormats,
  onToggleFormat,
  onSelectAll,
  onClearAll
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Target Output Formats
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {selectedFormats.length} of {FORMAT_OPTIONS.length} selected
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Select the channel deliverables to synthesize concurrently</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {FORMAT_OPTIONS.map((item) => {
          const isSelected = selectedFormats.includes(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => onToggleFormat(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${item.colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {item.category}
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
