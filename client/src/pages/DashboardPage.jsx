import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Flame,
  CheckCircle,
  Clock,
  Plus,
  Trophy,
  Bot,
  FileText,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import { useAuth } from '../context/AuthContext.jsx';
import { dashboardApi } from '../api/dashboardApi.js';
import { questionApi } from '../api/questionApi.js';
import { StatCard } from '../components/common/StatCard.jsx';
import { DifficultyBadge, PlatformBadge } from '../components/common/Badge.jsx';
import { SkeletonLoader } from '../components/common/Skeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { QuestionModal } from '../components/questions/QuestionModal.jsx';
import { CountdownTimer } from '../components/contests/CountdownTimer.jsx';
import { Toast } from '../components/common/Toast.jsx';

export const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartView, setChartView] = useState('weekly'); // 'weekly' or 'monthly'
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getActivity(),
      ]);

      if (statsRes.success) setDashboardData(statsRes.data);
      if (activityRes.success) setActivityData(activityRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateQuestion = async (formData) => {
    await questionApi.createQuestion(formData);
    setToast({ message: 'Problem logged successfully!', type: 'success' });
    await fetchDashboard();
    await refreshUser();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 rounded animate-pulse" />
        <SkeletonLoader />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const totalSolved = stats.totalSolved || 0;
  const easy = stats.easy || 0;
  const medium = stats.medium || 0;
  const hard = stats.hard || 0;
  const currentStreak = stats.currentStreak || 0;
  const longestStreak = stats.longestStreak || 0;

  const topTopics = dashboardData?.topTopics || [];
  const recentSolved = dashboardData?.recentSolved || [];
  const upcomingContests = dashboardData?.upcomingContests || [];
  const interviewSummary = dashboardData?.interviewSummary || {};

  const currentChartData =
    chartView === 'weekly' ? activityData?.weekly || [] : activityData?.monthly || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Greeting & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Preparing for <span className="text-indigo-400 font-semibold">{user?.targetRole}</span> • Keep solving daily to build momentum.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Question</span>
          </button>

          <Link
            to="/interviews"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow-purple transition-all flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            <span>AI Mock Interview</span>
          </Link>

          <Link
            to="/contests"
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Contests</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Solved"
          value={totalSolved}
          subtitle={`Across ${stats.totalQuestionsTracked || totalSolved} tracked`}
          icon={CheckCircle}
          accentColor="indigo"
          trend={`${stats.inProgressCount || 0} In Progress`}
        />

        <StatCard
          title="Coding Streak"
          value={`${currentStreak} Days`}
          subtitle={`Best: ${longestStreak} days continuous`}
          icon={Flame}
          accentColor="amber"
          trend={currentStreak > 0 ? 'Active Today' : 'Solve a problem today!'}
        />

        <StatCard
          title="Difficulty Split"
          value={`${easy}E • ${medium}M • ${hard}H`}
          subtitle="Easy / Medium / Hard"
          icon={TrendingUp}
          accentColor="cyan"
        />

        <StatCard
          title="AI Mock Score"
          value={
            interviewSummary.averageScore > 0
              ? `${interviewSummary.averageScore}/100`
              : 'Unrated'
          }
          subtitle={`${interviewSummary.completedSessions || 0} Simulations Completed`}
          icon={Bot}
          accentColor="purple"
        />
      </div>

      {/* Charts & Topic Mastery Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Problem Solving Consistency
              </h3>
            </div>

            {/* Toggle 7 Days vs 30 Days */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setChartView('weekly')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  chartView === 'weekly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  chartView === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Recharts Component */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'weekly' ? (
                <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} name="Solved Problems" />
                </BarChart>
              ) : (
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    name="Solved Problems"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* DSA Topic Mastery Summary (1 col) */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Solved Topics
              </h3>
              <Link to="/questions" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            {topTopics.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No questions solved yet. Start logging problems to see topic distribution!
              </p>
            ) : (
              <div className="space-y-3.5">
                {topTopics.map((item, idx) => {
                  const percent = Math.min(100, Math.round((item.count / Math.max(1, totalSolved)) * 100));
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">{item.topic}</span>
                        <span className="text-slate-400 font-mono">
                          {item.count} solved ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Pattern coverage</span>
            <span className="text-indigo-400 font-mono font-semibold">
              {topTopics.length}/20 Categories Active
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Questions & Upcoming Contests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Solved Questions Table (2 cols) */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Recent Solved Problems
            </h3>
            <Link to="/questions" className="text-xs font-semibold text-indigo-400 hover:underline">
              Open DSA Tracker →
            </Link>
          </div>

          {recentSolved.length === 0 ? (
            <EmptyState
              title="No problems logged yet"
              description="Keep track of every DSA question you solve, along with key insights and revision notes."
              actionText="Log Your First Problem"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="divide-y divide-slate-800/80">
              {recentSolved.map((q) => (
                <div
                  key={q._id}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {q.title}
                      </span>
                      {q.problemUrl && (
                        <a
                          href={q.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-indigo-400"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span>{q.topic}</span>
                      <span>•</span>
                      <span>{new Date(q.dateSolved).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <PlatformBadge platform={q.platform} />
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Contests Widget (1 col) */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Upcoming Contests
              </h3>
              <Link to="/contests" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            {upcomingContests.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No contests scheduled right now.
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {upcomingContests.slice(0, 3).map((c) => (
                  <div key={c.id} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <PlatformBadge platform={c.platform} />
                      <CountdownTimer targetDate={c.startTime} endDate={c.endTime} />
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 line-clamp-1">{c.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      {new Date(c.startTime).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/contests"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore All Contests & Bookmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Add Question Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateQuestion}
      />
    </div>
  );
};
