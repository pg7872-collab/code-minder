import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Bot, Sparkles, AlertCircle, Plus, X } from 'lucide-react';

const INTERVIEW_TYPES = [
  'DSA',
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'Backend',
  'Frontend',
  'HR',
  'Full Stack',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const InterviewSetupModal = ({ isOpen, onClose, onStart, initialTopics = [] }) => {
  const [role, setRole] = useState('Software Development Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState('DSA');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [topicInput, setTopicInput] = useState('');
  const [focusTopics, setFocusTopics] = useState(initialTopics || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTopic = () => {
    if (topicInput.trim() && !focusTopics.includes(topicInput.trim())) {
      setFocusTopics([...focusTopics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (t) => {
    setFocusTopics(focusTopics.filter((item) => item !== t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onStart({
        role,
        difficulty,
        interviewType,
        totalQuestions: Number(totalQuestions),
        focusTopics,
      });
    } catch (err) {
      setError(err.message || 'Failed to start interview session.');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure AI Interview Simulation" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Target Role *
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Interview Type & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Interview Track *
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              {INTERVIEW_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Difficulty *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 5, 7, 10].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setTotalQuestions(num)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  totalQuestions === num
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {num} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Focus Topics */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Focus Topics (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTopic();
                }
              }}
              placeholder="e.g. Dynamic Programming, Event Loop"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {focusTopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {focusTopics.map((topic, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                >
                  <span>{topic}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Questions generated live by Gemini with rubric evaluation
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-glow-primary transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Start Simulation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
