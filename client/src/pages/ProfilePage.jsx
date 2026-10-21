import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Flame,
  CheckCircle,
  Trophy,
  ExternalLink,
  RefreshCw,
  Bookmark,
  Calendar,
  Sparkles,
  Link2,
} from 'lucide-react';
import { profileApi } from '../api/profileApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatCard } from '../components/common/StatCard.jsx';
import { DifficultyBadge, PlatformBadge } from '../components/common/Badge.jsx';
import { SkeletonLoader } from '../components/common/Skeleton.jsx';
import { Toast } from '../components/common/Toast.jsx';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // External profile sync states
  const [lcUsername, setLcUsername] = useState('');
  const [cfUsername, setCfUsername] = useState('');
  const [syncingPlatform, setSyncingPlatform] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.success && res.data) {
        setProfileData(res.data);
        if (res.data.user?.externalProfiles?.leetcode?.username) {
          setLcUsername(res.data.user.externalProfiles.leetcode.username);
        }
        if (res.data.user?.externalProfiles?.codeforces?.username) {
          setCfUsername(res.data.user.externalProfiles.codeforces.username);
        }
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to load profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSync = async (platform, username) => {
    if (!username.trim()) {
      setToast({ message: `Please enter a ${platform} username.`, type: 'error' });
      return;
    }

    setSyncingPlatform(platform);
    try {
      const res = await profileApi.syncExternal(platform, username);
      if (res.success) {
        setToast({ message: `${platform} profile synchronized successfully!`, type: 'success' });
        await fetchProfile();
        await refreshUser();
      }
    } catch (err) {
      setToast({ message: err.message || `Failed to sync ${platform} profile.`, type: 'error' });
    } finally {
      setSyncingPlatform('');
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  const u = profileData?.user || user;
  const stats = profileData?.stats || u.stats || {};
  const questionsSummary = profileData?.questionsSummary || {};
  const lc = u.externalProfiles?.leetcode;
  const cf = u.externalProfiles?.codeforces;
  const bookmarkedContests = profileData?.bookmarkedContests || [];
  const revisionQuestions = profileData?.revisionQuestions || [];
  const timeline = profileData?.activityTimeline?.weekly || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Profile Overview Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <img
              src={
                u?.avatar ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(u?.name || 'User')}`
              }
              alt={u?.name}
              className="w-20 h-20 rounded-2xl border-2 border-indigo-500/40 bg-slate-800 object-cover shadow-glow-primary"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight">{u?.name}</h1>
              <p className="text-xs text-slate-400 font-mono">{u?.email}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{u?.targetRole}</span>
                </span>
                {u?.college && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {u.college} {u.graduationYear ? `('${String(u.graduationYear).slice(-2)})` : ''}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Streak Overview */}
          <div className="flex items-center space-x-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="text-center px-3 border-r border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Streak</p>
              <p className="text-xl font-black font-mono text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{stats.currentStreak || 0}d</span>
              </p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Longest Streak</p>
              <p className="text-xl font-black font-mono text-cyan-400">
                {stats.longestStreak || 0}d
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solved Stats Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Solved"
          value={questionsSummary.totalSolved || 0}
          subtitle={`Across ${questionsSummary.totalTracked || 0} total questions`}
          icon={CheckCircle}
          accentColor="indigo"
        />
        <StatCard
          title="Easy Solved"
          value={questionsSummary.easy || 0}
          subtitle="Foundational problems"
          icon={CheckCircle}
          accentColor="emerald"
        />
        <StatCard
          title="Medium Solved"
          value={questionsSummary.medium || 0}
          subtitle="Core interview standards"
          icon={CheckCircle}
          accentColor="amber"
        />
        <StatCard
          title="Hard Solved"
          value={questionsSummary.hard || 0}
          subtitle="Advanced algorithms & DP"
          icon={CheckCircle}
          accentColor="rose"
        />
      </div>

      {/* External Platform Sync Section */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" />
            Connect External Coding Profiles
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Link official LeetCode and Codeforces accounts to aggregate statistics on your Code Minder developer profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LeetCode Sync */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                <span>LeetCode Official Sync</span>
              </span>
              {lc?.lastFetched && (
                <span className="text-[10px] text-slate-500">
                  Synced: {new Date(lc.lastFetched).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="LeetCode username"
                value={lcUsername}
                onChange={(e) => setLcUsername(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSync('leetcode', lcUsername)}
                disabled={syncingPlatform === 'leetcode'}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {syncingPlatform === 'leetcode' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Sync</span>
                )}
              </button>
            </div>

            {lc?.username && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500">Solved</p>
                  <p className="text-sm font-bold text-white">{lc.solved}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500">Ranking</p>
                  <p className="text-sm font-bold text-amber-400">{lc.ranking?.toLocaleString() || '—'}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500">Med / Hard</p>
                  <p className="text-sm font-bold text-indigo-400">
                    {lc.medium}/{lc.hard}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Codeforces Sync */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                <span>Codeforces Official Sync</span>
              </span>
              {cf?.lastFetched && (
                <span className="text-[10px] text-slate-500">
                  Synced: {new Date(cf.lastFetched).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Codeforces handle"
                value={cfUsername}
                onChange={(e) => setCfUsername(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSync('codeforces', cfUsername)}
                disabled={syncingPlatform === 'codeforces'}
                className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {syncingPlatform === 'codeforces' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Sync</span>
                )}
              </button>
            </div>

            {cf?.username && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500">Rating</p>
                  <p className="text-sm font-bold text-blue-400">{cf.rating || 0}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500">Rank</p>
                  <p className="text-sm font-bold text-purple-400">{cf.rank || 'Unrated'}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500">Solved</p>
                  <p className="text-sm font-bold text-white">{cf.solved || 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookmarked Contests & Flagged Revision Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookmarked Contests */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              Bookmarked Contests
            </h4>
            <span className="text-xs text-slate-400">{bookmarkedContests.length} Saved</span>
          </div>

          {bookmarkedContests.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No bookmarked contests yet. Star upcoming contests from the Contests tab.
            </p>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {bookmarkedContests.map((b) => (
                <div key={b._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{b.title}</span>
                    <p className="text-[11px] text-slate-500">{new Date(b.startTime).toLocaleString()}</p>
                  </div>
                  <PlatformBadge platform={b.platform} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flagged Revision Questions */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
              Revision Queue
            </h4>
            <span className="text-xs text-slate-400">{revisionQuestions.length} To Review</span>
          </div>

          {revisionQuestions.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Your revision queue is clear! Star questions on the DSA Tracker to mark them.
            </p>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {revisionQuestions.map((rq) => (
                <div key={rq._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{rq.title}</span>
                    <p className="text-[11px] text-amber-400/90">{rq.revisionNotes || rq.topic}</p>
                  </div>
                  <DifficultyBadge difficulty={rq.difficulty} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
