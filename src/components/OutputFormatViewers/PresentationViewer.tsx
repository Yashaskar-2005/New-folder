import React, { useState } from 'react';
import { Presentation, Download, ChevronLeft, ChevronRight, Copy, Check, MessageSquare, Image, Sparkles } from 'lucide-react';
import { StructuredOutputItem } from '../../types';
import { downloadExport } from '../../services/api';

interface Props {
  output: StructuredOutputItem;
  jobTitle: string;
}

export const PresentationViewer: React.FC<Props> = ({ output, jobTitle }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const data = output.structured_data || {};
  const slides = data.slides || [
    {
      slide_number: 1,
      title: output.title || 'Presentation Slide',
      bullets: ['Automated Content Repurposing Engine', 'Enterprise Gen AI Architecture'],
      speaker_notes: 'Welcome everyone to this presentation.',
      visual_prompt: 'Modern minimalist abstract gradient'
    }
  ];

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(output.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPPTX = async () => {
    try {
      setDownloading(true);
      await downloadExport('pptx', jobTitle || 'Presentation_Deck', [output]);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to generate PowerPoint file. Ensure backend is running.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-600/20 text-orange-400 rounded-lg border border-orange-500/30">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Presentation Slide Deck</h3>
            <p className="text-xs text-slate-400">{slides.length} slides • Speaker scripts & visual prompts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Markdown' : 'Copy Text'}
          </button>

          <button
            onClick={handleDownloadPPTX}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-900/30 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Building .PPTX...' : 'Download Real PowerPoint (.pptx)'}
          </button>
        </div>
      </div>

      {/* Interactive Slide Viewer Canvas */}
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Slide Carousel Controller */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Slide:</span>
            <div className="flex gap-1">
              {slides.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                    currentSlideIndex === idx
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-900/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 16:9 Simulated Slide Frame */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700/80 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Slide Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-orange-400 tracking-wider uppercase">
                {currentSlide.slide_type || `SLIDE 0${currentSlideIndex + 1}`}
              </span>
              <span className="text-xs font-mono text-slate-500">TransformAI Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              {currentSlide.title}
            </h2>
          </div>

          {/* Slide Bullets */}
          <div className="relative z-10 my-auto py-4">
            <ul className="space-y-3.5">
              {(currentSlide.bullets || []).map((bullet: string, bIdx: number) => (
                <li key={bIdx} className="text-sm md:text-base text-slate-200 flex items-start gap-3">
                  <span className="text-orange-400 font-bold text-lg leading-none mt-0.5">•</span>
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slide Footer */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Gen AI Automated Presentation</span>
            <span>Slide {currentSlideIndex + 1}</span>
          </div>
        </div>

        {/* Speaker Script & Visual Direction Tray */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speaker Notes */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Presenter Speaker Script
            </h4>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "{currentSlide.speaker_notes || 'Introduce the core problem and outline the transformation milestones.'}"
            </p>
          </div>

          {/* Visual Prompt Recommendation */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-orange-400" /> Recommended Visual / Asset Prompt
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              `{currentSlide.visual_prompt || 'Modern 3D architectural diagram with clean neural nodes'}`
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
