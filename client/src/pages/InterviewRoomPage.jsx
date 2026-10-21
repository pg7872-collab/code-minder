import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bot,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  FileCode,
  MessageSquare,
} from 'lucide-react';
import { interviewApi } from '../api/interviewApi.js';
import { CodeEditor } from '../components/interview/CodeEditor.jsx';
import { FeedbackCard } from '../components/interview/FeedbackCard.jsx';
import { InterviewReport } from '../components/interview/InterviewReport.jsx';
import { SkeletonLoader } from '../components/common/Skeleton.jsx';
import { Toast } from '../components/common/Toast.jsx';

export const InterviewRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  // User input states for active question
  const [userCode, setUserCode] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await interviewApi.getById(id);
      if (res.success && res.data) {
        const s = res.data;
        setSession(s);

        // Find current question to resume
        if (s.status === 'in-progress') {
          const targetIdx = s.currentQuestionIndex || 0;
          setCurrentIdx(Math.min(targetIdx, (s.questions?.length || 1) - 1));

          const activeQ = s.questions?.[targetIdx];
          if (activeQ) {
            setUserCode(activeQ.userCode || activeQ.codeTemplate || '');
            setUserAnswer(activeQ.userAnswer || '');
            if (activeQ.evaluation?.score !== null && activeQ.evaluation?.score !== undefined) {
              setLatestEvaluation(activeQ.evaluation);
            } else {
              setLatestEvaluation(null);
            }
          }
        }
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to load interview room.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() && !userCode.trim()) {
      setToast({
        message: 'Please provide either code or an explanation before submitting.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await interviewApi.submitAnswer(id, {
        questionIndex: currentIdx,
        userAnswer,
        userCode,
      });

      if (res.success && res.data) {
        setSession(res.data.session);
        setLatestEvaluation(res.data.evaluation);
        setToast({ message: 'Answer evaluated by Gemini rubric!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Evaluation failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    const isLast = currentIdx + 1 >= (session.totalQuestions || 0);

    if (isLast) {
      // Finalize session
      setIsSubmitting(true);
      try {
        const completeRes = await interviewApi.completeInterview(id);
        if (completeRes.success && completeRes.data) {
          setSession(completeRes.data);
          setLatestEvaluation(null);
        }
      } catch (err) {
        setToast({ message: err.message || 'Could not finalize session', type: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Advance to next question
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextQ = session.questions[nextIdx];
      setUserCode(nextQ?.userCode || nextQ?.codeTemplate || '');
      setUserAnswer(nextQ?.userAnswer || '');
      setLatestEvaluation(nextQ?.evaluation?.score !== null ? nextQ?.evaluation : null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Session not found.</p>
        <button
          onClick={() => navigate('/interviews')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Interviews
        </button>
      </div>
    );
  }

  // If session is completed, render final performance report
  if (session.status === 'completed') {
    return (
      <InterviewReport
        session={session}
        onRestart={() => navigate('/interviews')}
      />
    );
  }

  const currentQ = session.questions?.[currentIdx] || {};
  const isLastQuestion = currentIdx + 1 >= (session.totalQuestions || 0);
  const progressPercent = Math.round(((currentIdx + 1) / (session.totalQuestions || 1)) * 100);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Top Session Status Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {session.interviewType} Practice Room
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {session.difficulty}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Role: <span className="text-slate-300 font-normal">{session.role}</span>
          </h2>
        </div>

        {/* Question Counter & Progress */}
        <div className="flex flex-col sm:items-end space-y-1.5">
          <div className="text-xs font-mono font-bold text-indigo-400">
            Question {currentIdx + 1} of {session.totalQuestions}
          </div>
          <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Question Statement Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-indigo-400" />
            Interviewer Prompt
          </span>
          <span className="text-xs font-mono text-slate-500">
            Topic: {session.interviewType}
          </span>
        </div>

        <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
          {currentQ.question}
        </p>
      </div>

      {/* Workspace Area: Code or Text based on Track */}
      <div className="space-y-4">
        {/* Code Editor for DSA or Technical Tracks */}
        {(session.interviewType === 'DSA' || currentQ.codeTemplate || currentQ.type === 'dsa') && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Solution Code Workspace</span>
            </label>
            <CodeEditor
              code={userCode}
              onChange={setUserCode}
              initialTemplate={currentQ.codeTemplate}
              language="javascript"
              readOnly={!!latestEvaluation}
            />
          </div>
        )}

        {/* Written Explanation / Conceptual Answer */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>
              {session.interviewType === 'DSA'
                ? 'Time & Space Complexity & Approach Explanation'
                : 'Your Answer & Technical Explanation'}
            </span>
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!latestEvaluation}
            rows={5}
            placeholder={
              session.interviewType === 'DSA'
                ? 'Explain the algorithmic intuition, time complexity O(...), and space complexity trade-offs.'
                : 'Structure your explanation clearly with core concepts, architectural trade-offs, and examples.'
            }
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm leading-relaxed"
          />
        </div>

        {/* Submit Button (Visible when evaluation not yet showing) */}
        {!latestEvaluation && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-glow-primary transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Answer with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Answer for AI Review</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Evaluation Feedback Component */}
      {latestEvaluation && (
        <FeedbackCard
          evaluation={latestEvaluation}
          onNext={handleNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
};
