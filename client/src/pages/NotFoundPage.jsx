import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-glow-primary">
        <Code2 className="w-8 h-8" />
      </div>

      <h1 className="text-6xl font-black font-mono text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-3">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The route you are attempting to access does not exist or has been relocated.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-primary transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
