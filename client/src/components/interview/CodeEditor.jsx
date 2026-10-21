import React, { useState } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';

export const CodeEditor = ({
  code,
  onChange,
  language = 'javascript',
  initialTemplate = '',
  readOnly = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (code || '').split('\n').length;

  return (
    <div className="bg-[#0D1117] border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs flex flex-col shadow-xl">
      {/* Editor Header */}
      <div className="bg-[#161B22] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-semibold text-slate-300 ml-2 uppercase text-[10px] tracking-wider">
            {language} Solution Workspace
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {initialTemplate && !readOnly && (
            <button
              onClick={() => onChange(initialTemplate)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title="Reset starter template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex min-h-[220px] max-h-[400px] overflow-auto">
        {/* Line Numbers */}
        <div className="bg-[#0D1117] text-slate-600 select-none py-3 px-3 text-right border-r border-slate-800/80 font-mono text-[11px] leading-relaxed">
          {Array.from({ length: Math.max(10, lineCount) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder="// Type your optimal solution here..."
          className="flex-1 bg-transparent text-slate-200 p-3 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/30 whitespace-pre"
          rows={Math.max(10, lineCount)}
          spellCheck={false}
        />
      </div>

      {/* Footer Disclaimer */}
      <div className="px-3 py-1.5 bg-[#161B22]/50 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
        <span>Evaluated for algorithmic time & space complexity</span>
        <span>AI Rubric Evaluation</span>
      </div>
    </div>
  );
};
