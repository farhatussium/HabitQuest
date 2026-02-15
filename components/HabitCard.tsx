
import React, { useMemo, useState } from 'react';
import { Habit, Completion } from '../types';

interface HabitCardProps {
  habit: Habit;
  completions: Completion[];
  onToggle: () => void;
  onDelete: () => void;
  onUpdateReminders: (enabled: boolean) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, completions, onToggle, onDelete, onUpdateReminders }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = completions.some(c => c.habitId === habit.id && c.date === today);

  const streak = useMemo(() => {
    const habitCompletions = completions
      .filter(c => c.habitId === habit.id)
      .map(c => c.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let count = 0;
    let checkDate = new Date();
    
    if (!isCompletedToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const uniqueDates: string[] = Array.from(new Set(habitCompletions));

    for (const date of uniqueDates) {
      const d = new Date(date);
      const diff = Math.floor((checkDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (diff > 0) {
        break;
      }
    }

    return isCompletedToday && count === 0 ? 1 : count;
  }, [completions, habit.id, isCompletedToday]);

  const handleToggle = () => {
    if (!isCompletedToday) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onToggle();
  };

  return (
    <div className={`group relative p-5 rounded-3xl transition-all duration-500 ease-out border-2 ${
      isCompletedToday 
      ? 'bg-white dark:bg-slate-900 border-indigo-500/20 shadow-lg shadow-indigo-500/5 dark:shadow-none' 
      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none'
    }`}>
      
      {/* Background Glow Effect for Completed State */}
      {isCompletedToday && (
        <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
        </div>
      )}

      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          
          {/* Checkbox Button */}
          <button 
            onClick={handleToggle}
            className={`relative w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 transform active:scale-90 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
              isCompletedToday 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-100 dark:border-slate-700'
            }`}
          >
            {isAnimating && (
              <div className="absolute inset-0 rounded-[1.25rem] border-4 border-indigo-400 animate-ripple pointer-events-none"></div>
            )}
            
            {isCompletedToday ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-check" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-2xl font-light">+</span>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 group/title">
              <h4 className={`text-lg font-bold truncate transition-all duration-500 ${
                isCompletedToday 
                ? 'text-slate-400 dark:text-slate-500' 
                : 'text-slate-800 dark:text-slate-100'
              }`}>
                {habit.name}
              </h4>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateReminders(!habit.remindersEnabled);
                }}
                className={`p-1.5 rounded-lg transition-all transform active:scale-90 ${
                  habit.remindersEnabled 
                  ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-500/20' 
                  : 'text-slate-300 dark:text-slate-700 hover:text-slate-500 dark:hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={habit.remindersEnabled ? "Reminders Enabled" : "Reminders Disabled"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${
                isCompletedToday 
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400'
              }`}>
                <span className={isCompletedToday ? 'animate-bounce' : ''}>🔥</span>
                {streak} Day Streak
              </span>

              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {habit.preferredTime}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Container */}
        <div className="flex items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if(window.confirm('Are you sure you want to delete this habit?')) onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transform hover:scale-110 active:scale-95"
            aria-label="Delete Habit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Subtle Bottom Progress indicator */}
      <div className={`absolute bottom-0 left-0 h-1 rounded-b-3xl transition-all duration-700 ease-in-out ${
        isCompletedToday ? 'w-full bg-indigo-500 shadow-[0_-4px_10px_rgba(79,70,229,0.2)]' : 'w-0 bg-slate-200 dark:bg-slate-700'
      }`}></div>
    </div>
  );
};

export default HabitCard;
