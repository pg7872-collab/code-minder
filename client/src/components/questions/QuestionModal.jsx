import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { ExternalLink, Clock, Bookmark, AlertCircle } from 'lucide-react';

const TOPICS = [
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
  'Other',
];

const PLATFORMS = [
  'LeetCode',
  'GeeksforGeeks',
  'CodeStudio',
  'Codeforces',
  'HackerRank',
  'InterviewBit',
  'Other',
];

export const QuestionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    problemUrl: '',
    difficulty: 'Medium',
    topic: 'Arrays',
    status: 'Solved',
    dateSolved: new Date().toISOString().split('T')[0],
    notes: '',
    timeTakenMinutes: '',
    needsRevision: false,
    revisionNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        platform: initialData.platform || 'LeetCode',
        problemUrl: initialData.problemUrl || '',
        difficulty: initialData.difficulty || 'Medium',
        topic: initialData.topic || 'Arrays',
        status: initialData.status || 'Solved',
        dateSolved: initialData.dateSolved
          ? new Date(initialData.dateSolved).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
        timeTakenMinutes: initialData.timeTakenMinutes || '',
        needsRevision: initialData.needsRevision || false,
        revisionNotes: initialData.revisionNotes || '',
      });
    } else {
      setFormData({
        title: '',
        platform: 'LeetCode',
        problemUrl: '',
        difficulty: 'Medium',
        topic: 'Arrays',
        status: 'Solved',
        dateSolved: new Date().toISOString().split('T')[0],
        notes: '',
        timeTakenMinutes: '',
        needsRevision: false,
        revisionNotes: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a question title.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({
        ...formData,
        timeTakenMinutes: formData.timeTakenMinutes ? Number(formData.timeTakenMinutes) : 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit DSA Question' : 'Log Solved Question'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Problem Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Longest Palindromic Substring"
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
          />
        </div>

        {/* Problem URL & Platform */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Problem URL</span>
              <span className="text-[11px] text-slate-500 font-normal">Optional</span>
            </label>
            <input
              type="url"
              name="problemUrl"
              value={formData.problemUrl}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Difficulty, Topic, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Difficulty *
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              DSA Topic *
            </label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="Solved">Solved</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Solved Date & Time Taken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Date Solved
            </label>
            <input
              type="date"
              name="dateSolved"
              value={formData.dateSolved}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Time Taken (Minutes)
            </label>
            <input
              type="number"
              name="timeTakenMinutes"
              value={formData.timeTakenMinutes}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 25"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Revision Checkbox */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Bookmark className={`w-4 h-4 ${formData.needsRevision ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm font-semibold text-slate-200">Flag for Revision</p>
              <p className="text-xs text-slate-400">Mark to review before upcoming interviews</p>
            </div>
          </div>
          <input
            type="checkbox"
            name="needsRevision"
            checked={formData.needsRevision}
            onChange={handleChange}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900"
          />
        </div>

        {formData.needsRevision && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
              Revision Notes / Pitfalls
            </label>
            <textarea
              name="revisionNotes"
              value={formData.revisionNotes}
              onChange={handleChange}
              rows={2}
              placeholder="What tricky edge case or algorithm step should you remember?"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>
        )}

        {/* Notes / Solution Approach */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Approach & Key Insights
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Optimal complexity, two-pointer trick, DP recurrence relation, etc."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-glow-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Log Question'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
