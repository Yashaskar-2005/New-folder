import React, { useState } from 'react';
import { Copy, Check, MessageSquare, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { StructuredOutputItem } from '../../types';

interface Props {
  output: StructuredOutputItem;
}

export const TwitterViewer: React.FC<Props> = ({ output }) => {
  const [copiedThread, setCopiedThread] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const data = output.structured_data || {};
  
  const tweets = data.tweets || [
    { tweet_number: 1, text: output.content_markdown, character_count: output.content_markdown.length }
  ];

  const handleCopyThread = () => {
    const threadText = tweets.map((t: any) => t.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(threadText);
    setCopiedThread(true);
    setTimeout(() => setCopiedThread(false), 2000);
  };

  const handleCopySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Twitter / X Multi-Tweet Thread</h3>
            <p className="text-xs text-slate-400">{tweets.length} sequential tweets • Character-bounded (&lt;280 chars each)</p>
          </div>
        </div>
        <button
          onClick={handleCopyThread}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-sky-900/30 active:scale-95"
        >
          {copiedThread ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copiedThread ? 'Thread Copied!' : 'Copy Entire Thread'}
        </button>
      </div>

      {/* Sequential Tweet Stream */}
      <div className="max-w-2xl mx-auto space-y-4 relative">
        {/* Thread connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800 -z-0" />

        {tweets.map((tweet: any, idx: number) => {
          const charLen = tweet.text ? tweet.text.length : (tweet.character_count || 0);
          const isOverLimit = charLen > 280;

          return (
            <div key={idx} className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
                    {tweet.tweet_number || idx + 1}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Tweet {tweet.tweet_number || idx + 1} of {tweets.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isOverLimit ? 'bg-rose-950/60 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-400'}`}>
                    {charLen} / 280
                  </span>
                  <button
                    onClick={() => handleCopySingle(tweet.text, idx)}
                    title="Copy this tweet"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {copiedIndex === idx ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {tweet.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
