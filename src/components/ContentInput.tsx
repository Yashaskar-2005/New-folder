import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Sparkles, X, CheckCircle, AlertCircle, FileUp, Mic, MicOff, Volume2, Radio } from 'lucide-react';
import { uploadDocument } from '../services/api';
import { PresetSample } from '../types';

interface Props {
  sourceText: string;
  sourceTitle: string;
  onTextChange: (text: string) => void;
  onTitleChange: (title: string) => void;
  onLoadPreset: (preset: PresetSample) => void;
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'cyber-advisory',
    title: 'CrowdStrike Windows Kernel Panic Incident',
    category: 'Cybersecurity Threat Advisory',
    description: 'Critical analysis of the global sensor configuration logic error affecting 8.5M machines.',
    tone: 'authoritative',
    target_audience: 'c_suite',
    recommendedFormats: ['advisory', 'exec_summary', 'linkedin', 'twitter'],
    text: `On July 19, 2024, cybersecurity firm CrowdStrike deployed a routine sensor configuration update to Windows systems running Falcon Sensor version 7.11 and above. The update contained an out-of-bounds memory read logic defect within Channel File 291, causing a kernel-level page fault and immediate Blue Screen of Death (BSOD) on an estimated 8.5 million endpoints globally. The failure triggered cascading disruptions across commercial aviation, healthcare systems, financial institutions, and government infrastructure. Immediate recovery required administrators to boot impacted endpoints into Windows Safe Mode, navigate to C:\\Windows\\System32\\drivers\\CrowdStrike, and manually delete the offending channel file. CrowdStrike conducted an exhaustive root cause analysis, committing to phased deployment rings, kernel memory bounds checking in the Content Validator, and enhanced independent third-party code reviews. Organizations are advised to implement strict endpoint staging environments before applying automated kernel configurations.`
  },
  {
    id: 'ai-launch',
    title: 'Autonomous Multi-Agent AI Framework Release',
    category: 'Product & AI Breakthrough',
    description: 'Enterprise launch of an autonomous agent swarm reducing content workflows by 85%.',
    tone: 'professional',
    target_audience: 'developers',
    recommendedFormats: ['linkedin', 'twitter', 'video_script', 'infographic', 'presentation'],
    text: `Today marks the general availability of AgentSwarm v3, an enterprise-grade autonomous Generative AI orchestration platform engineered to automate multi-format content synthesis and cross-channel distribution. By coordinating specialized LLM agents across prompt engineering, fact-verification, and JSON schema compilation, AgentSwarm delivers an 85% acceleration in content delivery cycles and a 4.2x throughput multiplier compared to traditional authoring pipelines. The architecture introduces deterministic JSON schema validation, zero-shot multimodal document ingestion for PDF/DOCX, and real-time hallucination scoring. With over 100,000 active developers in preview, early enterprise benchmarks confirm seamless compliance with corporate branding guidelines and strict API rate limiting.`
  },
  {
    id: 'quantum-research',
    title: 'Topological Quantum Computing Coherence Milestone',
    category: 'Scientific & Academic Research',
    description: 'Peer-reviewed breakthrough in quantum error correction and topological qubit fidelity.',
    tone: 'technical',
    target_audience: 'general',
    recommendedFormats: ['exec_summary', 'infographic', 'presentation', 'linkedin'],
    text: `A collaborative research consortium between leading university laboratories and quantum computing institutes has achieved a major milestone in topological quantum error correction. By stabilizing Majorana zero modes across semiconductor-superconductor nanowire junctions, researchers demonstrated a 10x improvement in qubit coherence times, maintaining quantum states beyond 15 milliseconds under ambient cryogenic temperatures. The breakthrough solves a fundamental bottleneck in fault-tolerant quantum computing by dramatically reducing the physical-to-logical qubit overhead from 1000:1 to less than 40:1. The findings, published in leading physical review journals, pave the way for scalable quantum simulation of room-temperature superconductors and molecular catalyst synthesis within the next five years.`
  }
];

export const ContentInput: React.FC<Props> = ({
  sourceText,
  sourceTitle,
  onTextChange,
  onTitleChange,
  onLoadPreset
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'upload' | 'presets'>('text');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-US' | 'hi-IN'>('en-US');
  const recognitionRef = useRef<any>(null);
  const sourceTextRef = useRef(sourceText);

  useEffect(() => {
    sourceTextRef.current = sourceText;
  }, [sourceText]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome, Brave, or Microsoft Edge!');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.resultIndex >= 0 && event.results[i].isFinal) {
            finalTranscript += ' ' + event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          const updated = sourceTextRef.current
            ? `${sourceTextRef.current.trim()} ${finalTranscript.trim()}`
            : finalTranscript.trim();
          onTextChange(updated);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone permission was denied. Please allow microphone access in your browser settings.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await uploadDocument(file);
      onTextChange(res.extracted_text);
      if (!sourceTitle || sourceTitle === 'Untitled Source Content') {
        onTitleChange(file.name.replace(/\.[^/.]+$/, ''));
      }
      setUploadedFileName(file.name);
      setActiveTab('text');
    } catch (err: any) {
      setUploadError(err.message || 'File parsing failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
      {/* Top Tabs & 1-Click Quick Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Content</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>1-Click Presets</span>
          </button>
        </div>

        {/* Word / Char Counters */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
            <strong className="text-indigo-400">{wordCount}</strong> words
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hidden sm:inline">
            <strong className="text-cyan-400">{charCount}</strong> chars
          </span>
          {sourceText && (
            <button
              onClick={() => {
                onTextChange('');
                setUploadedFileName(null);
              }}
              title="Clear text"
              className="p-1 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Try Sample:
        </span>
        {PRESET_SAMPLES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              onLoadPreset(preset);
              setActiveTab('text');
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-600/50 transition-all text-left truncate max-w-[200px]"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Tab 1: Paste Text Input */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          {uploadedFileName && (
            <div className="flex items-center justify-between p-2.5 bg-indigo-950/30 border border-indigo-800/40 rounded-lg text-xs text-indigo-200">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Loaded from file: <strong>{uploadedFileName}</strong>
              </span>
              <button onClick={() => setUploadedFileName(null)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Source Title (Optional)
            </label>
            <input
              type="text"
              value={sourceTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Q3 Cybersecurity Threat Advisory or New Product Architecture"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Source Content / Document Body
              </label>

              {/* Voice-to-Text Speech Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value as 'en-US' | 'hi-IN')}
                  title="Speech Recognition Language"
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                >
                  <option value="en-US">🎙️ English</option>
                  <option value="hi-IN">🎙️ Hindi (हिंदी)</option>
                </select>

                <button
                  type="button"
                  onClick={toggleVoiceDictation}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    isListening
                      ? 'bg-rose-600 text-white shadow-rose-900/60 ring-2 ring-rose-500 animate-pulse'
                      : 'bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-800/60'
                  }`}
                  title="Click to dictate content using your microphone"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-white animate-bounce" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span>Speak to Type</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Listening Banner */}
            {isListening && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-200 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-semibold">
                    Microphone active in {speechLang === 'hi-IN' ? 'Hindi' : 'English'}... Speak into your mic!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleVoiceDictation}
                  className="px-2.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-md text-[11px] transition-colors"
                >
                  Done / Stop
                </button>
              </div>
            )}

            <textarea
              rows={8}
              value={sourceText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Paste article text, raw incident notes, or click 'Speak to Type' above to dictate with your voice..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed font-sans"
            />
          </div>
        </div>
      )}

      {/* Tab 2: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt,.md,.json"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 bg-slate-950/60 hover:bg-indigo-950/20 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileUp className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Click or drag & drop document</h4>
              <p className="text-xs text-slate-400 mt-1">Supports PDF (.pdf), Word (.docx), Markdown (.md), Plain Text (.txt)</p>
            </div>
            <span className="inline-block text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              In-memory stream parsing (Max 25MB)
            </span>
          </div>

          {isUploading && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl flex items-center gap-3 text-xs text-indigo-200">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Extracting and normalizing document text...</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Curated Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {PRESET_SAMPLES.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onLoadPreset(preset);
                setActiveTab('text');
              }}
              className="p-4 bg-slate-950/60 border border-slate-800 hover:border-indigo-500/60 rounded-xl cursor-pointer hover:bg-indigo-950/20 transition-all space-y-2 group"
            >
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/60">
                {preset.category}
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                {preset.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {preset.description}
              </p>
              <div className="pt-2 text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Load this sample →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
