import React from 'react';
import { Sliders, Users, MessageSquare, Globe, AlignLeft } from 'lucide-react';

interface Props {
  tone: string;
  targetAudience: string;
  language: string;
  detailLevel: string;
  onToneChange: (tone: string) => void;
  onAudienceChange: (audience: string) => void;
  onLanguageChange: (language: string) => void;
  onDetailChange: (detail: string) => void;
}

export const ParameterControls: React.FC<Props> = ({
  tone,
  targetAudience,
  language,
  detailLevel,
  onToneChange,
  onAudienceChange,
  onLanguageChange,
  onDetailChange,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-white">Generation Parameters & Tone Tuning</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Tone of Voice
          </label>
          <select
            value={tone}
            onChange={(e) => onToneChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="professional">Professional & Balanced</option>
            <option value="authoritative">Authoritative & Decisive</option>
            <option value="casual">Casual & Engaging</option>
            <option value="technical">Highly Technical & Analytical</option>
            <option value="urgent">Urgent & Direct Action</option>
          </select>
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> Target Audience
          </label>
          <select
            value={targetAudience}
            onChange={(e) => onAudienceChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="general">General Public</option>
            <option value="c_suite">C-Suite & Executive Leadership</option>
            <option value="developers">Software Engineers & DevOps</option>
            <option value="marketers">Growth Marketers & Creators</option>
            <option value="students">Students & Academic Researchers</option>
          </select>
        </div>

        {/* Language Localization */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Output Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Hinglish">Hinglish (Colloquial)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
            <option value="German">German (Deutsch)</option>
          </select>
        </div>

        {/* Level of Detail */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-amber-400" /> Depth & Length
          </label>
          <select
            value={detailLevel}
            onChange={(e) => onDetailChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="brief">Brief & Punchy</option>
            <option value="standard">Standard Balanced</option>
            <option value="comprehensive">Comprehensive & Deep Dive</option>
          </select>
        </div>
      </div>
    </div>
  );
};
