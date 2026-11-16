import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, Clock, BookOpen, Lightbulb, GraduationCap } from 'lucide-react';
import api from '../services/api';

export default function AiSummaryModal({ isOpen, onClose, resourceId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && resourceId) {
      fetchSummary();
    }
  }, [isOpen, resourceId]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/ai/summarize/${resourceId}`);
      setData(res.data);
    } catch (err) {
      setError('Could not generate AI summary at this time.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl border border-indigo-100 dark:border-dark-border max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">StudyHub AI Notes Summarizer</h3>
              <p className="text-xs text-indigo-100">Smart Academic Synthesis & Exam Key Points</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-14 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Analyzing document contents & synthesizing takeaways...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Overview */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Conceptual Overview
                </h4>
                <div className="p-4 bg-indigo-50/60 dark:bg-dark-card rounded-2xl border border-indigo-100/80 dark:border-dark-border text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {data.overview}
                </div>
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border">
                  <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Est. Revision</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    {data.estimatedReadTime}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border">
                  <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Complexity</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                    {data.difficultyLevel}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-dark-card rounded-xl border border-slate-100 dark:border-dark-border col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Subject</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white truncate block">
                    {data.subject}
                  </span>
                </div>
              </div>

              {/* Key takeaways */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {data.keyTakeaways.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-dark-card p-3 rounded-xl border border-slate-100 dark:border-dark-border"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exam tips */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Exam Scoring Strategies
                </h4>
                <div className="space-y-2">
                  {data.examTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-amber-500 font-bold shrink-0">💡</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-dark-card border-t border-slate-100 dark:border-dark-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl hover:bg-slate-100 dark:hover:bg-dark-card transition-colors shadow-2xs"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
}
