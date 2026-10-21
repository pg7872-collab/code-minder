import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Bot,
  FileText,
  Trophy,
  Flame,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-primary">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              Code Minder
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                MERN + Gemini AI
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all flex items-center gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-400/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered DSA & Technical Interview Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Track DSA mastery.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Simulate AI interviews.
            </span>
            <br />
            Land top tech offers.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Code Minder brings together your problem tracking, contest countdowns, resume ATS auditing,
            and interactive Gemini-evaluated mock interviews into one unified developer platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-glow-primary transition-all flex items-center justify-center space-x-2"
            >
              <span>{isAuthenticated ? "Open Dashboard" : "Start Preparing Free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore Demo Account</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800">
              <p className="text-2xl font-black font-mono text-indigo-400">20+ Topics</p>
              <p className="text-xs text-slate-400 mt-1">Arrays to DP & Graphs</p>
            </div>
            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800">
              <p className="text-2xl font-black font-mono text-cyan-400">Gemini 1.5</p>
              <p className="text-xs text-slate-400 mt-1">Rubric AI Interviewer</p>
            </div>
            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800">
              <p className="text-2xl font-black font-mono text-purple-400">ATS Audit</p>
              <p className="text-xs text-slate-400 mt-1">PDF Resume Analysis</p>
            </div>
            <div className="p-4 rounded-xl bg-[#111827]/70 border border-slate-800">
              <p className="text-2xl font-black font-mono text-emerald-400">Live Contests</p>
              <p className="text-xs text-slate-400 mt-1">Countdowns & Alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Walkthroughs */}
      <section className="py-16 bg-[#0E1322] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Aspiring Software Engineers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to systematically organize your technical preparation from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/40 transition-colors shadow-lg">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Full DSA Question Tracker</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log problems from LeetCode, Codeforces, and GeeksforGeeks. Tag patterns, maintain revision notes, track time taken, and monitor topic-by-topic completion percentages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition-colors shadow-lg">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Gemini AI Interview Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice 1-on-1 mock interviews customized to your target role. Submit code and explanations, receive instant rubric scores, and get model answers for improvement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition-colors shadow-lg">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI-Powered Resume Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your PDF resume. Extract text in-memory and evaluate qualifications against your target role with Google Gemini. Receive ATS keyword gaps and high-impact bullet rewrites.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/40 transition-colors shadow-lg">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Contest Aggregator & Tickers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never miss a weekly contest. Live countdown timers, multi-platform aggregation across LeetCode, Codeforces, and CodeChef, with bookmarking and timezone conversion.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-colors shadow-lg">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Streak & Activity Heatmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stay accountable with daily active streaks, weekly problem volume charts, and monthly activity heatmaps computed directly from your solved problems.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/40 transition-colors shadow-lg">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">External Profile Aggregation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your public LeetCode and Codeforces usernames. Automatically fetch your official problem counts and competitive contest rating directly into your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Code Minder. Built with React, Tailwind CSS, Node.js, Express, MongoDB & Google Gemini AI.</p>
      </footer>
    </div>
  );
};
