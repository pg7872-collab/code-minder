import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@codeminder.io');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <Link to="/" className="flex items-center space-x-2.5 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
          <Code2 className="w-6 h-6" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white">
          Code Minder
        </span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Sign In</h2>
          <p className="text-xs text-slate-400">
            Welcome back! Continue your DSA and interview practice.
          </p>
        </div>

        {/* Demo Account Banner */}
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-2 hover:bg-indigo-500/15 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Click to Auto-Fill Demo Credentials (demo@codeminder.io)</span>
        </button>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow-primary transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
