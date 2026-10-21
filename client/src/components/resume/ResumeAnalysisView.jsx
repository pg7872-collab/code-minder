import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trash2,
  Code,
} from 'lucide-react';

export const ResumeAnalysisView = ({ analysis, onDelete, onStartInterviewWithTopics }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysis) return null;

  const score = analysis.overallScore || 75;
  const scoreColor =
    score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {analysis.targetRole}
            </span>
            <span className="text-xs text-slate-400">
              • Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            Analysis Report: <span className="text-slate-300 font-normal">{analysis.originalFileName}</span>
          </h3>
        </div>

        <div className="flex items-center space-x-4">
          {/* Score Badge */}
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900 border border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Readiness Score</p>
            <p className={`text-2xl font-black font-mono ${scoreColor}`}>
              {score}<span className="text-xs text-slate-500">/100</span>
            </p>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(analysis._id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
              title="Delete report"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto space-x-2 text-sm">
        {[
          { id: 'overview', label: 'Overview & Skills' },
          { id: 'strengths', label: 'Strengths & Gaps' },
          { id: 'bullets', label: 'Bullet Point Rewrites' },
          { id: 'ats', label: 'ATS & Keywords' },
          { id: 'study', label: 'Study Topics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Categorized Skills */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Executive Evaluation
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">
              {analysis.overallAssessment}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              Identified Technical Stack
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.technicalSkills?.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                  <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                    {cat.category}
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills?.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Strengths & Weaknesses / Missing Skills */}
      {activeTab === 'strengths' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Key Strengths Found
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {analysis.strengths?.map((str, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Missing / Underrepresented for {analysis.targetRole}
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.missingSkills?.map((ms, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
                >
                  {ms}
                </span>
              ))}
            </div>
            {analysis.weaknesses && (
              <div className="pt-3 border-t border-rose-500/20 space-y-1.5 text-xs text-slate-300">
                <p className="font-semibold text-rose-300">Improvement Areas:</p>
                {analysis.weaknesses.map((w, wi) => (
                  <p key={wi}>• {w}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Bullet Point Suggestions */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Transform passive duty descriptions into high-impact, quantifiable accomplishment statements.
          </p>

          {analysis.bulletPointSuggestions?.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <p className="text-[11px] uppercase font-bold text-rose-400 tracking-wider">Before</p>
                <p className="text-xs text-slate-400 line-through mt-0.5">{item.original}</p>
              </div>

              <div>
                <p className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                  Recommended High-Impact Rewrite
                </p>
                <p className="text-xs text-emerald-300 font-medium mt-0.5">{item.improved}</p>
              </div>

              {item.reasoning && (
                <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  💡 {item.reasoning}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: ATS Feedback */}
      {activeTab === 'ats' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Keywords Matched
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {analysis.atsFeedback?.keywordsFound?.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Recommended Keywords to Add
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {analysis.atsFeedback?.keywordsMissing?.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {analysis.atsFeedback?.formatNotes && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Formatting Notes</h5>
              <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                {analysis.atsFeedback.formatNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Recommended Study Topics */}
      {activeTab === 'study' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Core knowledge gaps and topics you should revise before technical interviews for {analysis.targetRole}:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.recommendedTopics?.map((topic, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between group hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">{topic}</span>
                </div>
              </div>
            ))}
          </div>

          {onStartInterviewWithTopics && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => onStartInterviewWithTopics(analysis.recommendedTopics)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-glow-primary"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Mock Interview on These Topics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
