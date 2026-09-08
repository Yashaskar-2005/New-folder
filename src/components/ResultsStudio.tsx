import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Clock, 
  FileText, 
  FileCode, 
  Globe, 
  Presentation,
  CheckCircle2,
  MessageSquare,
  ShieldAlert,
  Clapperboard,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { Linkedin } from './LinkedinIcon';
import { TransformResponse, StructuredOutputItem, OutputFormatType, TransformRequest } from '../types';
import { LinkedInViewer } from './OutputFormatViewers/LinkedInViewer';
import { TwitterViewer } from './OutputFormatViewers/TwitterViewer';
import { AdvisoryViewer } from './OutputFormatViewers/AdvisoryViewer';
import { VideoScriptViewer } from './OutputFormatViewers/VideoScriptViewer';
import { InfographicViewer } from './OutputFormatViewers/InfographicViewer';
import { ExecSummaryViewer } from './OutputFormatViewers/ExecSummaryViewer';
import { PresentationViewer } from './OutputFormatViewers/PresentationViewer';
import { downloadExport, regenerateFormat } from '../services/api';

interface Props {
  response: TransformResponse;
  currentRequest: TransformRequest;
  onUpdateOutput: (updatedItem: StructuredOutputItem) => void;
}

const FORMAT_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin,
  twitter: MessageSquare,
  advisory: ShieldAlert,
  video_script: Clapperboard,
  infographic: BarChart3,
  exec_summary: Briefcase,
  presentation: Presentation
};

const FORMAT_NAMES: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  advisory: 'Advisory',
  video_script: 'Video Script',
  infographic: 'Infographic',
  exec_summary: 'Exec Summary',
  presentation: 'Presentation'
};

export const ResultsStudio: React.FC<Props> = ({
  response,
  currentRequest,
  onUpdateOutput
}) => {
  const [activeFormat, setActiveFormat] = useState<OutputFormatType>(
    response.outputs[0]?.output_type || 'linkedin'
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const activeOutput = response.outputs.find((o) => o.output_type === activeFormat) || response.outputs[0];

  const handleRegenerateCurrent = async () => {
    if (!activeOutput) return;
    try {
      setIsRegenerating(true);
      const updated = await regenerateFormat(activeFormat, currentRequest);
      onUpdateOutput(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate format');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = async (format: string) => {
    setShowExportMenu(false);
    try {
      await downloadExport(format, response.source_title, response.outputs);
    } catch (err: any) {
      alert(err.message || `Download failed for ${format}`);
    }
  };

  const renderActiveViewer = () => {
    if (!activeOutput) return null;

    switch (activeOutput.output_type) {
      case 'linkedin':
        return <LinkedInViewer output={activeOutput} />;
      case 'twitter':
        return <TwitterViewer output={activeOutput} />;
      case 'advisory':
        return <AdvisoryViewer output={activeOutput} />;
      case 'video_script':
        return <VideoScriptViewer output={activeOutput} />;
      case 'infographic':
        return <InfographicViewer output={activeOutput} />;
      case 'exec_summary':
        return <ExecSummaryViewer output={activeOutput} />;
      case 'presentation':
        return <PresentationViewer output={activeOutput} jobTitle={response.source_title} />;
      default:
        return (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-2">{activeOutput.title}</h3>
            <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap">
              {activeOutput.content_markdown}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-lg font-extrabold text-white">Results Studio</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
              {response.outputs.length} Formats Ready
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="truncate max-w-xs text-slate-300 font-medium">"{response.source_title}"</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-cyan-400" /> {response.duration_seconds}s
            </span>
            <span>•</span>
            <span className="text-indigo-300 font-mono">{response.model_used}</span>
          </div>
        </div>

        {/* Action Controls: Regenerate & Master Export */}
        <div className="flex items-center gap-2.5 relative">
          <button
            onClick={handleRegenerateCurrent}
            disabled={isRegenerating}
            title="Regenerate this specific format"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Tab'}</span>
          </button>

          {/* Master Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/30 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Deliverables</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <button
                  onClick={() => handleDownload('markdown')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Master Report (.md)</span>
                </button>
                <button
                  onClick={() => handleDownload('html')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Printable HTML (.html)</span>
                </button>
                <button
                  onClick={() => handleDownload('pptx')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Presentation className="w-4 h-4 text-orange-400" />
                  <span>PowerPoint Slides (.pptx)</span>
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>Structured JSON (.json)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Format Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {response.outputs.map((item) => {
          const Icon = FORMAT_ICONS[item.output_type] || FileText;
          const isActive = activeFormat === item.output_type;

          return (
            <button
              key={item.output_type}
              onClick={() => setActiveFormat(item.output_type)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50 border border-indigo-500'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{FORMAT_NAMES[item.output_type] || item.output_type}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'}`}>
                {item.word_count}w
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Active Format Viewer Component */}
      <div className="pt-2">
        {renderActiveViewer()}
      </div>
    </div>
  );
};
