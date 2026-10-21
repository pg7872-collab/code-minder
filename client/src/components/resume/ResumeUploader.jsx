import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

const TARGET_ROLES = [
  'Software Development Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Engineer',
  'DevOps / Cloud Engineer',
  'Other',
];

export const ResumeUploader = ({ onUpload, isAnalyzing }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF document (.pdf).');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Resume file size exceeds the 5MB limit. Please upload a smaller PDF.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a PDF resume to analyze.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);
    onUpload(formData);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">AI Resume Analyzer</h3>
          <p className="text-xs text-slate-400">
            Powered by Google Gemini — In-depth role alignment, ATS audit & bullet improvements
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Target Role Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Target Engineering Role *
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            disabled={isAnalyzing}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          >
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* File Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/5'
              : file
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
          }`}
        >
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
            disabled={isAnalyzing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
            {file ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Drop your PDF resume here, or <span className="text-indigo-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF documents only (Up to 5 MB)</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Security / ATS Notice */}
        <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            Resumes are extracted in-memory and not permanently saved on server disks. Code Minder provides algorithmic guidance and does not guarantee interview selection.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || isAnalyzing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing Resume with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume for {targetRole}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
