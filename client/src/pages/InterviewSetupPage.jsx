import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, Sparkles, Play, History, ArrowRight, Trophy, Clock, CheckCircle } from 'lucide-react';
import { interviewApi } from '../api/interviewApi.js';
import { InterviewSetupModal } from '../components/interview/InterviewSetupModal.jsx';
import { StatCard } from '../components/common/StatCard.jsx';
import { CardSkeleton } from '../components/common/Skeleton.jsx';
import { Toast } from '../components/common/Toast.jsx';

export const InterviewSetupPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const navigate = useNavigate();
  const location = useLocation();
  const initialTopics = location.state?.topics || [];

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await interviewApi.getHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.warn('Could not load interview history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (initialTopics.length > 0) {
      setIsModalOpen(true);
    }
  }, []);

  const handleStartSession = async (config) => {
    const res = await interviewApi.startInterview(config);
    if (res.success && res.data) {
      navigate(`/interviews/room/${res.data._id}`);
    }
  };

  const completedSessions = history.filter((h) => h.status === 'completed');
  const avgScore = completedSessions.length > 0
    ? Math.round(
        completedSessions.reduce((acc, curr) => acc + (curr.overallReport?.averageScore || 0), 0) /
          completedSessions.length
      )
    : 0;

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

      {/* Header & Launcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>AI Technical Interview Simulator</span>
            <Bot className="w-6 h-6 text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate realistic technical and behavioral interviews with Google Gemini, evaluated on industrial grading rubrics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-glow-primary transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Configure New Mock Interview</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Interviews Completed"
          value={completedSessions.length}
          subtitle={`Across ${history.length} total sessions`}
          icon={CheckCircle}
          accentColor="indigo"
        />
        <StatCard
          title="Average Rubric Score"
          value={avgScore > 0 ? `${avgScore} / 100` : '—'}
          subtitle={avgScore >= 75 ? 'Ready for onsite technical rounds' : 'Continue regular practice'}
          icon={Trophy}
          accentColor="purple"
        />
        <StatCard
          title="Available Tracks"
          value="8 Specialized"
          subtitle="DSA, React, Node, System Design, HR"
          icon={Bot}
          accentColor="cyan"
        />
      </div>

      {/* Track Selection Cards Quick Launch */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Quick Launch Tracks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'DSA & Algorithms', track: 'DSA', desc: 'Two pointers, Trees, Dynamic Programming, Graphs', color: 'indigo' },
            { name: 'Full-Stack JavaScript', track: 'JavaScript', desc: 'Event Loop, Closures, Promises, Async patterns', color: 'cyan' },
            { name: 'React Architecture', track: 'React', desc: 'Fiber reconciliation, Hooks, State management', color: 'purple' },
            { name: 'Node.js & Backend', track: 'Backend', desc: 'Streams, Clusters, DB indexing, REST design', color: 'emerald' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.track}
                </span>
                <h4 className="text-base font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Start Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Sessions History */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Interview History & Detailed Reports
          </h3>
          <span className="text-xs text-slate-400">{history.length} Sessions</span>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-slate-500">Loading interview records...</div>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            No interview sessions taken yet. Click "Configure New Mock Interview" to launch your first session!
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {history.map((h) => {
              const score = h.overallReport?.averageScore || 0;
              const date = new Date(h.createdAt).toLocaleDateString();

              return (
                <div
                  key={h._id}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {h.role}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {h.interviewType}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800/60 text-slate-400">
                        {h.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Date: {date} • Status: <span className="uppercase font-semibold">{h.status}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {h.status === 'completed' && (
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {score}/100
                        </span>
                        <p className="text-[10px] text-slate-400">{h.overallReport?.performanceRating}</p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/interviews/room/${h._id}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>{h.status === 'completed' ? 'View Report' : 'Resume Session'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Setup Modal */}
      <InterviewSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={handleStartSession}
        initialTopics={initialTopics}
      />
    </div>
  );
};
