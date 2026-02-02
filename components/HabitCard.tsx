
import React, { useMemo } from 'react';
import { Habit, Completion } from '../types';

interface HabitCardProps {
  habit: Habit;
  completions: Completion[];
  onToggle: () => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, completions, onToggle, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = completions.some(c => c.habitId === habit.id && c.date === today);

  const streak = useMemo(() => {
    const habitCompletions = completions
      .filter(c => c.habitId === habit.id)
      .map(c => c.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let count = 0;
    let checkDate = new Date();
    
    // If not completed today, start checking from yesterday
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

  return (
    <div className={`group p-5 rounded-2xl shadow-sm border transition-all duration-300 ${
      isCompletedToday 
      ? 'bg-indigo-50/10 border-indigo-200 ring-2 ring-indigo-50 dark:ring-indigo-900/20 dark:border-indigo-800' 
      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
    }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onToggle}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
              isCompletedToday 
              ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200 dark:shadow-none' 
              : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-indigo-400 border-2 border-slate-100 dark:border-slate-700'
            }`}
          >
            {isCompletedToday ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-2xl font-light">+</span>
            )}
          </button>

          <div className="flex-1">
            <h4 className={`text-lg font-bold ${isCompletedToday ? 'text-indigo-950 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-100'}`}>
              {habit.name}
            </h4>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-orange-500 flex items-center gap-1">
                🔥 {streak} Day Streak
              </span>
              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                ⏰ {habit.preferredTime}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if(window.confirm('Are you sure you want to delete this habit?')) onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all rounded-lg"
          aria-label="Delete Habit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
