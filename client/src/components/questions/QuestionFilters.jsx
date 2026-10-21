import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';

const TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Binary Search Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Binary Search',
  'Stack',
  'Queue',
  'Heap',
  'Hashing',
  'Trie',
  'Bit Manipulation',
  'Two Pointers',
  'Sliding Window',
  'Math',
  'Matrix',
  'Design',
];

const PLATFORMS = ['All', 'LeetCode', 'GeeksforGeeks', 'CodeStudio', 'Codeforces', 'HackerRank', 'Other'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES = ['All', 'Solved', 'In Progress', 'Not Started'];

export const QuestionFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-4">
      {/* Top Bar: Search + Quick Toggles */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by title, pattern, or keyword..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
          />
        </div>

        {/* Needs Revision Quick Filter & Reset */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() =>
              onFilterChange('needsRevision', filters.needsRevision === 'true' ? 'All' : 'true')
            }
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1.5 ${
              filters.needsRevision === 'true'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span>Revision Needed</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            title="Reset All Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
        {/* Topic */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Topic
          </label>
          <select
            value={filters.topic || 'All'}
            onChange={(e) => onFilterChange('topic', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Difficulty
          </label>
          <select
            value={filters.difficulty || 'All'}
            onChange={(e) => onFilterChange('difficulty', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Platform
          </label>
          <select
            value={filters.platform || 'All'}
            onChange={(e) => onFilterChange('platform', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status || 'All'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Sort Order
          </label>
          <select
            value={`${filters.sortBy || 'dateSolved'}_${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('_');
              onFilterChange('sortBy', sortBy);
              onFilterChange('sortOrder', sortOrder);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="dateSolved_desc">Date (Newest)</option>
            <option value="dateSolved_asc">Date (Oldest)</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="difficulty_asc">Difficulty (Easy-Hard)</option>
            <option value="difficulty_desc">Difficulty (Hard-Easy)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
