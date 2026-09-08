import React, { useState } from 'react';
import { Copy, Check, Share2, Sparkles } from 'lucide-react';
import { Linkedin } from '../LinkedinIcon';
import { StructuredOutputItem } from '../../types';

interface Props {
  output: StructuredOutputItem;
}

export const LinkedInViewer: React.FC<Props> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const data = output.structured_data || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hashtags = data.hashtags || ['#Innovation', '#AI', '#TechLeadership'];
  const takeaways = data.key_takeaways || [];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Linkedin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">LinkedIn Thought Leadership Post</h3>
            <p className="text-xs text-slate-400">Algorithmic stop-the-scroll hook with high-engagement formatting</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {output.word_count} words
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-blue-900/30 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Post' : 'Copy Full Post'}
          </button>
        </div>
      </div>

      {/* Simulated LinkedIn Post Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl mx-auto">
        {/* Mock Author Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            AI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-sm">TransformAI Executive</span>
              <span className="text-xs text-slate-500">• 1st</span>
            </div>
            <p className="text-xs text-slate-400">Automated Content Repurposing Engine • 1m ago</p>
          </div>
        </div>

        {/* Hook Callout */}
        {data.hook && (
          <div className="p-3.5 mb-4 bg-indigo-950/40 border border-indigo-800/40 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Stop-The-Scroll Hook
            </div>
            <p className="text-sm font-medium text-indigo-100">{data.hook}</p>
          </div>
        )}

        {/* Post Body */}
        <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed space-y-3 font-normal">
          {output.content_markdown}
        </div>

        {/* Key Takeaways Section */}
        {takeaways.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/70">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Highlight Bullets:</h4>
            <div className="space-y-1.5">
              {takeaways.map((pt: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
            {hashtags.map((tag: string, i: number) => (
              <span key={i} className="text-xs text-blue-400 hover:underline cursor-pointer">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
