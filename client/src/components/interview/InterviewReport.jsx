import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const InterviewReport = ({ session, onRestart }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!session) return null;

  const report = session.overallReport || {};
  const averageScore = report.averageScore || 0;
  const rating = report.performanceRating || 'Completed';

  const ratingColors = {
    'Strong Hire': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'Hire': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'Borderline': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Needs Practice': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  const currentBadge = ratingColors[rating] || ratingColors['Hire'];

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-glow-primary">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Simulation Completed
        </h2>
        <p className="text-xs text-slate-400">
          Role: <span className="text-slate-200 font-semibold">{session.role}</span> • Track:{' '}
          <span className="text-slate-200 font-semibold">{session.interviewType}</span> ({session.difficulty})
        </p>

        {/* Score & Rating Pill */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <div className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xl font-bold text-white">
            {averageScore} / 100
          </div>
          <div className={`px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-wider ${currentBadge}`}>
            {rating}
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Executive Interviewer Feedback
        </h4>
        <p className="text-slate-200 text-sm leading-relaxed">{report.summary}</p>
      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Demonstrated Strengths
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
            {report.keyStrengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Recommended Polish Areas
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
            {report.areasForImprovement?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Study Plan */}
      {report.studyPlan && report.studyPlan.length > 0 && (
        <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Actionable 7-Day Study Plan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {report.studyPlan.map((step, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-indigo-400 mr-2">Step {idx + 1}:</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question by Question Review Accordion */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Question by Question Detailed Review
        </h4>
        <div className="space-y-2">
          {session.questions?.map((q, idx) => {
            const isExpanded = expandedQuestion === idx;
            const qScore = q.evaluation?.score || 0;

            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40"
              >
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {q.question}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {qScore}/100
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 space-y-3 text-xs">
                    {q.userAnswer && (
                      <div>
                        <p className="font-bold text-slate-400 mb-1">Your Explanation:</p>
                        <p className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          {q.userAnswer}
                        </p>
                      </div>
                    )}

                    {q.userCode && (
                      <div>
                        <p className="font-bold text-slate-400 mb-1">Your Code:</p>
                        <pre className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto">
                          {q.userCode}
                        </pre>
                      </div>
                    )}

                    {q.evaluation?.feedback && (
                      <div>
                        <p className="font-bold text-indigo-400 mb-1">Feedback:</p>
                        <p className="text-slate-300 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/20">
                          {q.evaluation.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800 flex justify-center">
        {onRestart && (
          <button
            onClick={onRestart}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Another Practice Interview</span>
          </button>
        )}
      </div>
    </div>
  );
};
