import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, History, Trash2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { resumeApi } from '../api/resumeApi.js';
import { ResumeUploader } from '../components/resume/ResumeUploader.jsx';
import { ResumeAnalysisView } from '../components/resume/ResumeAnalysisView.jsx';
import { SkeletonLoader } from '../components/common/Skeleton.jsx';
import { Toast } from '../components/common/Toast.jsx';

export const ResumeAnalyzerPage = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await resumeApi.getHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.warn('Could not load history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUploadResume = async (formData) => {
    setIsAnalyzing(true);
    try {
      const res = await resumeApi.analyzeResume(formData);
      if (res.success && res.data) {
        setCurrentAnalysis(res.data);
        setToast({ message: 'Resume analysis completed with Gemini!', type: 'success' });
        await fetchHistory();
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to analyze resume.', type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = async (id) => {
    try {
      const res = await resumeApi.getById(id);
      if (res.success) {
        setCurrentAnalysis(res.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Could not load record', type: 'error' });
    }
  };

  const handleDeleteAnalysis = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await resumeApi.deleteAnalysis(id);
      setToast({ message: 'Analysis record deleted.', type: 'info' });
      if (currentAnalysis?._id === id) {
        setCurrentAnalysis(null);
      }
      await fetchHistory();
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete record', type: 'error' });
    }
  };

  const handleStartInterviewWithTopics = (topics) => {
    navigate('/interviews', { state: { topics } });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>AI Resume Analyzer</span>
          <Sparkles className="w-6 h-6 text-purple-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload your resume in PDF format to receive role-aligned ATS audit, keyword gaps, and Google XYZ bullet rewrites.
        </p>
      </div>

      {/* Upload Box (Visible when not actively viewing a single report or toggled) */}
      {!currentAnalysis && (
        <ResumeUploader onUpload={handleUploadResume} isAnalyzing={isAnalyzing} />
      )}

      {/* Detailed Analysis View */}
      {currentAnalysis && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentAnalysis(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-600 transition-colors"
            >
              ← Upload Another Resume
            </button>
          </div>
          <ResumeAnalysisView
            analysis={currentAnalysis}
            onDelete={handleDeleteAnalysis}
            onStartInterviewWithTopics={handleStartInterviewWithTopics}
          />
        </div>
      )}

      {/* Previous Analyses History Section */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Previous Resume Analyses
          </h3>
          <span className="text-xs text-slate-400">{history.length} Saved Records</span>
        </div>

        {loadingHistory ? (
          <div className="py-4 text-center text-xs text-slate-500">Loading analysis history...</div>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No previous resume scans found. Upload a resume above to save your first audit.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {history.map((item) => (
              <div
                key={item._id}
                className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {item.originalFileName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {item.targetRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scanned on {new Date(item.createdAt).toLocaleDateString()} • ATS Readiness: {item.atsFeedback?.score || item.overallScore}%
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSelectHistory(item._id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnalysis(item._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
