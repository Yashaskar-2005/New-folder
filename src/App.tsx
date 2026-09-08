import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Cpu,
  Share2,
  FileText
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { ContentInput, PRESET_SAMPLES } from './components/ContentInput';
import { OutputSelector, FORMAT_OPTIONS } from './components/OutputSelector';
import { ParameterControls } from './components/ParameterControls';
import { ResultsStudio } from './components/ResultsStudio';
import { HistoryModal } from './components/HistoryModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ProjectDocModal } from './components/ProjectDocModal';
import { SettingsModal } from './components/SettingsModal';

import { 
  OutputFormatType, 
  TransformRequest, 
  TransformResponse, 
  StructuredOutputItem, 
  PresetSample 
} from './types';
import { transformContent } from './services/api';

export const App: React.FC = () => {
  // Source inputs
  const [sourceTitle, setSourceTitle] = useState<string>('CrowdStrike Global IT Kernel Incident Advisory');
  const [sourceText, setSourceText] = useState<string>(PRESET_SAMPLES[0].text);
  const [sourceType, setSourceType] = useState<string>('preset');

  // Parameters
  const [selectedFormats, setSelectedFormats] = useState<OutputFormatType[]>([
    'linkedin', 'twitter', 'advisory', 'video_script', 'infographic', 'exec_summary', 'presentation'
  ]);
  const [tone, setTone] = useState<string>('authoritative');
  const [targetAudience, setTargetAudience] = useState<string>('c_suite');
  const [language, setLanguage] = useState<string>('English');
  const [detailLevel, setDetailLevel] = useState<string>('standard');

  // Settings
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [modelChoice, setModelChoice] = useState<string>(() => localStorage.getItem('gemini_model') || 'gemini-2.5-flash');

  // Results & Execution state
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [transformResult, setTransformResult] = useState<TransformResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [analyticsOpen, setAnalyticsOpen] = useState<boolean>(false);
  const [docsOpen, setDocsOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const handleToggleFormat = (fmt: OutputFormatType) => {
    setSelectedFormats((prev) => 
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const handleSelectAllFormats = () => {
    setSelectedFormats(FORMAT_OPTIONS.map((f) => f.id));
  };

  const handleClearAllFormats = () => {
    setSelectedFormats([]);
  };

  const handleLoadPreset = (preset: PresetSample) => {
    setSourceTitle(preset.title);
    setSourceText(preset.text);
    setSourceType('preset');
    setTone(preset.tone);
    setTargetAudience(preset.target_audience);
    setSelectedFormats(preset.recommendedFormats);
  };

  const handleSaveSettings = (newKey: string, newModel: string) => {
    setApiKey(newKey);
    setModelChoice(newModel);
    localStorage.setItem('gemini_api_key', newKey);
    localStorage.setItem('gemini_model', newModel);
  };

  const handleTransform = async () => {
    if (!sourceText.trim() || sourceText.trim().length < 15) {
      alert('Please enter or paste at least 15 characters of source text.');
      return;
    }

    if (selectedFormats.length === 0) {
      alert('Please select at least 1 target output format.');
      return;
    }

    try {
      setIsTransforming(true);
      setErrorMsg(null);

      const req: TransformRequest = {
        source_title: sourceTitle || 'Content Transformation',
        source_text: sourceText,
        source_type: sourceType,
        output_types: selectedFormats,
        tone,
        target_audience: targetAudience,
        language,
        detail_level: detailLevel,
        api_key_override: apiKey,
        model_choice: modelChoice,
      };

      const res = await transformContent(req);
      setTransformResult(res);

      // Trigger Confetti Celebration for examiners!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}

      // Smooth scroll down to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-studio-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);

    } catch (err: any) {
      setErrorMsg(err.message || 'Transformation failed. Please check backend connection.');
    } finally {
      setIsTransforming(false);
    }
  };

  const handleUpdateOutput = (updatedItem: StructuredOutputItem) => {
    if (!transformResult) return;
    setTransformResult({
      ...transformResult,
      outputs: transformResult.outputs.map((o) =>
        o.output_type === updatedItem.output_type ? updatedItem : o
      ),
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenAnalytics={() => setAnalyticsOpen(true)}
        onOpenDocs={() => setDocsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        activeModel={modelChoice}
        hasCustomKey={Boolean(apiKey && apiKey.trim())}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Transform Once, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Create Everywhere
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ingest text, research articles, incident advisories, PDFs, or DOCX documents and autonomously synthesize 
            LinkedIn posts, Twitter threads, executive advisories, video storyboards, infographic blueprints, and slide decks.
          </p>
        </section>

        {/* Input & Parameters Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Step 1: Content Ingestion */}
          <ContentInput
            sourceText={sourceText}
            sourceTitle={sourceTitle}
            onTextChange={setSourceText}
            onTitleChange={setSourceTitle}
            onLoadPreset={handleLoadPreset}
          />

          {/* Step 2: Target Format Selection */}
          <OutputSelector
            selectedFormats={selectedFormats}
            onToggleFormat={handleToggleFormat}
            onSelectAll={handleSelectAllFormats}
            onClearAll={handleClearAllFormats}
          />

          {/* Step 3: Parameters & Tone Tuning */}
          <ParameterControls
            tone={tone}
            targetAudience={targetAudience}
            language={language}
            detailLevel={detailLevel}
            onToneChange={setTone}
            onAudienceChange={setTargetAudience}
            onLanguageChange={setLanguage}
            onDetailChange={setDetailLevel}
          />

          {/* Primary Action Button */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-3">
            <button
              onClick={handleTransform}
              disabled={isTransforming || selectedFormats.length === 0}
              className="relative group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed glow-btn flex items-center gap-3"
            >
              {isTransforming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Synthesizing {selectedFormats.length} Formats...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
                  <span>Transform Into {selectedFormats.length} Channel Deliverables</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800 px-4 py-2 rounded-xl">
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        {/* Step 4: Results Studio */}
        {transformResult && (
          <section id="results-studio-section" className="pt-8">
            <ResultsStudio
              response={transformResult}
              currentRequest={{
                source_title: sourceTitle,
                source_text: sourceText,
                source_type: sourceType,
                output_types: selectedFormats,
                tone,
                target_audience: targetAudience,
                language,
                detail_level: detailLevel,
                api_key_override: apiKey,
                model_choice: modelChoice,
              }}
              onUpdateOutput={handleUpdateOutput}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <p>
            ContentForge AI Platform • Automated Content Transformation Engine
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setDocsOpen(true)} className="hover:text-slate-300 transition-colors">
              Viva Voce Guide
            </button>
            <span>•</span>
            <button onClick={() => setAnalyticsOpen(true)} className="hover:text-slate-300 transition-colors">
              Telemetry Analytics
            </button>
            <span>•</span>
            <button onClick={() => setHistoryOpen(true)} className="hover:text-slate-300 transition-colors">
              Session History
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectJob={(job) => {
          setTransformResult(job);
          setSourceTitle(job.source_title);
          setTimeout(() => {
            document.getElementById('results-studio-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      <AnalyticsModal
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />

      <ProjectDocModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        modelChoice={modelChoice}
        onSave={handleSaveSettings}
      />
    </div>
  );
};
export default App;
