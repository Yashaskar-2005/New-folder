import React, { useState } from 'react';
import { Clapperboard, Video, Clock, Mic, Eye, Copy, Check } from 'lucide-react';
import { StructuredOutputItem } from '../../types';

interface Props {
  output: StructuredOutputItem;
}

export const VideoScriptViewer: React.FC<Props> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const data = output.structured_data || {};
  const scenes = data.scenes || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30">
            <Clapperboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Video Script & Production Storyboard</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-purple-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {data.target_duration || '60-90s'}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{data.video_style || 'Explainer / Corporate'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-purple-900/30 active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Script' : 'Copy Full Script'}
        </button>
      </div>

      {/* Storyboard Scene Cards */}
      <div className="space-y-4">
        {scenes.map((scene: any, idx: number) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-purple-800/40 transition-all">
            {/* Scene Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/70">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-800 text-purple-300 font-bold text-xs font-mono">
                  SCENE {scene.scene_number || idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> {scene.timestamp || '0:00 - 0:15'}
                </span>
              </div>
              {scene.on_screen_text && (
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-800 text-cyan-300 rounded-md border border-slate-700 font-mono">
                  <Eye className="w-3 h-3" /> Lower-Third: "{scene.on_screen_text}"
                </div>
              )}
            </div>

            {/* Split Screen: Visual Cues vs Voiceover Narration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Visual Direction */}
              <div className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800/80">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Visual & Camera Direction
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scene.visual_direction}
                </p>
              </div>

              {/* Voiceover Script */}
              <div className="p-3.5 bg-indigo-950/20 rounded-lg border border-indigo-900/30">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> Spoken Voiceover Narration
                </span>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed italic">
                  "{scene.spoken_narration}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
