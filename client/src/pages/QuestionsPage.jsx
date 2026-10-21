import React, { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  Bookmark,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { questionApi } from '../api/questionApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { QuestionFilters } from '../components/questions/QuestionFilters.jsx';
import { QuestionTable } from '../components/questions/QuestionTable.jsx';
import { QuestionModal } from '../components/questions/QuestionModal.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { TableSkeleton } from '../components/common/Skeleton.jsx';
import { Toast } from '../components/common/Toast.jsx';

export const QuestionsPage = () => {
  const { refreshUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [topicProgress, setTopicProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopicProgress, setShowTopicProgress] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    topic: 'All',
    difficulty: 'All',
    platform: 'All',
    status: 'All',
    needsRevision: 'All',
    search: '',
    sortBy: 'dateSolved',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionApi.getQuestions(filters);
      if (res.success) {
        setQuestions(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to load questions', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicProgress = async () => {
    try {
      const res = await questionApi.getTopicProgress();
      if (res.success) {
        setTopicProgress(res.data || []);
      }
    } catch (err) {
      console.warn('Topic progress load notice:', err.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  useEffect(() => {
    fetchTopicProgress();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset page when filters change
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      topic: 'All',
      difficulty: 'All',
      platform: 'All',
      status: 'All',
      needsRevision: 'All',
      search: '',
      sortBy: 'dateSolved',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
  };

  const handleSaveQuestion = async (formData) => {
    if (editingQuestion) {
      await questionApi.updateQuestion(editingQuestion._id, formData);
      setToast({ message: 'Question updated successfully!', type: 'success' });
    } else {
      await questionApi.createQuestion(formData);
      setToast({ message: 'New question logged successfully!', type: 'success' });
    }
    setEditingQuestion(null);
    await fetchQuestions();
    await fetchTopicProgress();
    await refreshUser();
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to remove this question?')) return;
    try {
      await questionApi.deleteQuestion(id);
      setToast({ message: 'Question removed from your tracker.', type: 'info' });
      await fetchQuestions();
      await fetchTopicProgress();
      await refreshUser();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete question', type: 'error' });
    }
  };

  const handleToggleStatus = async (question) => {
    const nextStatus =
      question.status === 'Solved'
        ? 'In Progress'
        : question.status === 'In Progress'
        ? 'Not Started'
        : 'Solved';

    try {
      await questionApi.updateQuestion(question._id, { status: nextStatus });
      setToast({ message: `Status updated to ${nextStatus}`, type: 'success' });
      await fetchQuestions();
      await fetchTopicProgress();
      await refreshUser();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleToggleRevision = async (question) => {
    try {
      const nextRev = !question.needsRevision;
      await questionApi.updateQuestion(question._id, { needsRevision: nextRev });
      setToast({
        message: nextRev ? 'Flagged for revision' : 'Removed from revision list',
        type: 'info',
      });
      await fetchQuestions();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>DSA Question Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize problems across LeetCode, Codeforces, and GeeksforGeeks with revision tags.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowTopicProgress(!showTopicProgress)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>{showTopicProgress ? 'Hide Topic Stats' : 'Topic Completion'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Topic Completion Breakdown (Collapsible) */}
      {showTopicProgress && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Topic-Wise Completion Metrics
            </h3>
            <span className="text-xs text-slate-400">
              {topicProgress.filter((t) => t.solved > 0).length} Topics with Solved Problems
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topicProgress
              .filter((t) => t.total > 0)
              .map((tp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{tp.topic}</span>
                    <span className="text-indigo-400 font-mono">
                      {tp.solved}/{tp.total} ({tp.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${tp.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{tp.easy} Easy</span>
                    <span>{tp.medium} Med</span>
                    <span>{tp.hard} Hard</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <QuestionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Questions Content */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No questions match your current filters"
          description="Try clearing search filters or add a new DSA question to your tracking log."
          actionText="Add New Question"
          onAction={openAddModal}
        />
      ) : (
        <QuestionTable
          questions={questions}
          pagination={pagination}
          onPageChange={(newPage) => handleFilterChange('page', newPage)}
          onEdit={openEditModal}
          onDelete={handleDeleteQuestion}
          onToggleStatus={handleToggleStatus}
          onToggleRevision={handleToggleRevision}
        />
      )}

      {/* Add / Edit Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
      />
    </div>
  );
};
