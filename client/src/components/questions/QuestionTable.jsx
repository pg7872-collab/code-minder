import React from 'react';
import {
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { DifficultyBadge, StatusBadge, PlatformBadge } from '../common/Badge.jsx';

export const QuestionTable = ({
  questions = [],
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleRevision,
}) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 w-12 text-center">Rev</th>
              <th className="py-3.5 px-4">Problem</th>
              <th className="py-3.5 px-4">Topic</th>
              <th className="py-3.5 px-4">Difficulty</th>
              <th className="py-3.5 px-4">Platform</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {questions.map((q) => {
              const formattedDate = q.dateSolved
                ? new Date(q.dateSolved).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—';

              return (
                <tr
                  key={q._id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Revision Star Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleRevision(q)}
                      className="p-1 rounded hover:bg-slate-800 transition-colors"
                      title={q.needsRevision ? 'Flagged for revision' : 'Mark for revision'}
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          q.needsRevision
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Title & URL */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {q.title}
                      </span>
                      {q.problemUrl && (
                        <a
                          href={q.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-indigo-400 transition-colors"
                          title="Open problem link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    {q.revisionNotes && (
                      <p className="text-[11px] text-amber-400/90 mt-0.5 truncate max-w-sm">
                        ⚠️ {q.revisionNotes}
                      </p>
                    )}
                  </td>

                  {/* Topic */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-medium">
                      {q.topic}
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-4">
                    <DifficultyBadge difficulty={q.difficulty} />
                  </td>

                  {/* Platform */}
                  <td className="py-3.5 px-4">
                    <PlatformBadge platform={q.platform} />
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleStatus(q)}
                      title="Click to toggle status"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <StatusBadge status={q.status} />
                    </button>
                  </td>

                  {/* Date Solved & Time Taken */}
                  <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                    <div>{formattedDate}</div>
                    {q.timeTakenMinutes > 0 && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {q.timeTakenMinutes}m
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onEdit(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(q._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing{' '}
            <span className="font-semibold text-slate-200">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{pagination.total}</span> questions
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2 font-medium text-slate-300">
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
