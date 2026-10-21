import React from 'react';

export const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const currentStyle = styles[difficulty] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}
    >
      {difficulty}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Solved: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'In Progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Not Started': 'bg-slate-700/30 text-slate-400 border-slate-700',
  };

  const currentStyle = styles[status] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${currentStyle}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'Solved'
            ? 'bg-indigo-400'
            : status === 'In Progress'
            ? 'bg-cyan-400'
            : 'bg-slate-500'
        }`}
      />
      {status}
    </span>
  );
};

export const PlatformBadge = ({ platform }) => {
  const colors = {
    LeetCode: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Codeforces: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    GeeksforGeeks: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    CodeStudio: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    CodeChef: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    AtCoder: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };

  const current = colors[platform] || 'text-slate-300 bg-slate-800 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${current}`}>
      {platform}
    </span>
  );
};
