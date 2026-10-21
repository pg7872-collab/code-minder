import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No records found',
  description = 'Get started by creating your first record to begin tracking your coding journey.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#111827]/60 border border-slate-800/80 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-glow-primary">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all duration-200"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
