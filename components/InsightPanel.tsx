
import React, { useState, useEffect } from 'react';
import { Habit, Completion } from '../types';
import { getSmartInsights } from '../geminiService';

interface InsightPanelProps {
  habits: Habit[];
  completions: Completion[];
}

const InsightPanel: React.FC<InsightPanelProps> = ({ habits, completions }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habits.length > 0) {
      setLoading(true);
      getSmartInsights(habits, completions).then(res => {
        setInsight(res);
        setLoading(false);
      });
    }
  }, [habits, completions]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧠</span>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">AI Insights</h4>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
        </div>
      ) : (
        <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
          {insight || "Add some habits and complete them to get personalized AI insights on your behavior patterns."}
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
