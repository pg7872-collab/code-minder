import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Filter,
  Bookmark,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { contestApi } from '../api/contestApi.js';
import { ContestCard } from '../components/contests/ContestCard.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { CardSkeleton } from '../components/common/Skeleton.jsx';
import { Toast } from '../components/common/Toast.jsx';

const PLATFORMS = ['All', 'LeetCode', 'Codeforces', 'CodeChef', 'AtCoder'];

export const ContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('UPCOMING'); // 'UPCOMING', 'ALL', 'BOOKMARKED'
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await contestApi.getContests({
        platform: platformFilter === 'All' ? undefined : platformFilter,
      });
      if (res.success) {
        setContests(res.data || []);
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to fetch contests', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, [platformFilter]);

  const handleToggleBookmark = async (contest) => {
    try {
      if (contest.isBookmarked) {
        await contestApi.removeBookmark(contest.id);
        setContests((prev) =>
          prev.map((c) => (c.id === contest.id ? { ...c, isBookmarked: false } : c))
        );
        setToast({ message: 'Contest removed from bookmarks', type: 'info' });
      } else {
        await contestApi.bookmarkContest(contest.id, {
          title: contest.title,
          platform: contest.platform,
          url: contest.url,
          startTime: contest.startTime,
          durationSeconds: contest.durationSeconds,
        });
        setContests((prev) =>
          prev.map((c) => (c.id === contest.id ? { ...c, isBookmarked: true } : c))
        );
        setToast({ message: 'Contest bookmarked for reminders!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Could not update bookmark', type: 'error' });
    }
  };

  // Filter contests locally by status tab
  const displayedContests = contests.filter((c) => {
    if (statusFilter === 'BOOKMARKED') return c.isBookmarked;
    if (statusFilter === 'UPCOMING') return c.status === 'UPCOMING' || c.status === 'CODING';
    return true; // 'ALL'
  });

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
            <span>Coding Contest Aggregator</span>
            <Trophy className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live schedule for LeetCode, Codeforces, CodeChef, and AtCoder with automatic local timezone conversion.
          </p>
        </div>

        <button
          onClick={fetchContests}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Schedule</span>
        </button>
      </div>

      {/* Filter Tabs & Platform Bar */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('UPCOMING')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'UPCOMING'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming & Live
          </button>
          <button
            onClick={() => setStatusFilter('BOOKMARKED')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              statusFilter === 'BOOKMARKED'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked</span>
          </button>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Contests
          </button>
        </div>

        {/* Platform Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Platform:
          </span>
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                platformFilter === plat
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Contests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : displayedContests.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title={statusFilter === 'BOOKMARKED' ? 'No bookmarked contests' : 'No contests found'}
          description={
            statusFilter === 'BOOKMARKED'
              ? 'Bookmark upcoming contests to keep track of reminders.'
              : 'Try changing the platform filter or checking back soon.'
          }
          actionText={statusFilter === 'BOOKMARKED' ? 'View Upcoming Contests' : undefined}
          onAction={statusFilter === 'BOOKMARKED' ? () => setStatusFilter('UPCOMING') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedContests.map((c) => (
            <ContestCard
              key={c.id}
              contest={c}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
