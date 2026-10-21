import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export const FeedbackCard = ({ evaluation, onNext, isLastQuestion }) => {
  const [showSample, setShowSample] = useState(false);

  if (!evaluation) return null;

  const score = evaluation.score || 0;
  const scoreBadge =
    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    score >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-up">
      {/* Header with Score */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-lg font-bold text-white tracking-tight">Question Evaluation</h4>
          <p className="text-xs text-slate-400">Gemini AI Structured Rubric Assessment</p>
        </div>
        <div className={`px-4 py-1.5 rounded-xl border text-base font-bold font-mono ${scoreBadge}`}>
          Score: {score}/100
        </div>
      </div>

      {/* Main Feedback Paragraph */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
        {evaluation.feedback}
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
          <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Strengths Identified
          </h5>
          <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
            {evaluation.strengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Gaps */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
          <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Areas for Polish & Missing Concepts
          </h5>
          <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
            {evaluation.weaknesses?.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
            {evaluation.missingConcepts?.map((mc, i) => (
              <li key={`mc-${i}`} className="text-amber-300">Concept: {mc}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sample Answer Accordion */}
      {evaluation.sampleAnswer && (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
          <button
            onClick={() => setShowSample(!showSample)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-indigo-300 hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Optimal Model Solution / Answer</span>
            </span>
            {showSample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showSample && (
            <div className="p-4 bg-[#0D1117] border-t border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {evaluation.sampleAnswer}
            </div>
          )}
        </div>
      )}

      {/* Action CTA */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all"
        >
          <span>{isLastQuestion ? 'Complete Interview & View Final Report' : 'Proceed to Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
