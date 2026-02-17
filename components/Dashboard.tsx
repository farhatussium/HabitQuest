
import React, { useState, useEffect } from 'react';
import { Habit, Completion, Frequency, Priority, UserSettings } from '../types';
import HabitCard from './HabitCard';
import ProgressRing from './ProgressRing';
import InsightPanel from './InsightPanel';

interface DashboardProps {
  habits: Habit[];
  completions: Completion[];
  onAdd: (name: string, freq: Frequency, priority: Priority, time: string, reminders: boolean) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateReminders: (id: string, enabled: boolean) => void;
  settings: UserSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, completions, onAdd, onDelete, onToggle, onUpdateReminders, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFreq, setNewFreq] = useState<Frequency>('daily');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newTime, setNewTime] = useState(settings.defaultReminderTime);
  const [newReminders, setNewReminders] = useState(settings.defaultRemindersEnabled);

  // Sync modal state with settings when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setNewTime(settings.defaultReminderTime);
      setNewReminders(settings.defaultRemindersEnabled);
      setNewPriority('medium');
    }
  }, [isModalOpen, settings]);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = completions.filter(c => c.date === today).length;
  const progressPercent = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName, newFreq, newPriority, newTime, newReminders);
      setNewName('');
      setIsModalOpen(false);
    }
  };

  // Sort habits by priority (High > Medium > Low) and then by completion status
  const sortedHabits = [...habits].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    
    // Sort by priority first
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Today's Focus</h2>
          <p className="text-slate-500 dark:text-slate-400">Track your progress and build consistent wins.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center"
        >
          <span className="text-xl mr-2">+</span> New Habit
        </button>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Daily Success Score</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{progressPercent}%</p>
          </div>
          <ProgressRing percentage={progressPercent} size={80} strokeWidth={8} />
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Habits</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{habits.length}</p>
          <div className="mt-2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Check-ins</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{completions.length}</p>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">Keep growing!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Habit List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Your Habits</h3>
          {habits.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-colors">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No habits yet. Start small, grow big!</p>
            </div>
          ) : (
            sortedHabits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                completions={completions} 
                onToggle={() => onToggle(habit.id)}
                onDelete={() => onDelete(habit.id)}
                onUpdateReminders={(enabled) => onUpdateReminders(habit.id, enabled)}
              />
            ))
          )}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <InsightPanel habits={habits} completions={completions} />
          
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
            <h4 className="font-bold text-lg mb-2">Pro Tip</h4>
            <p className="text-indigo-100 text-sm">
              Focus on your <strong>High Priority</strong> habits first. Completing your most important tasks early creates momentum for the rest of your day.
            </p>
          </div>
        </div>
      </div>

      {/* New Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Habit</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Habit Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Morning Meditation"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                        newPriority === p 
                        ? p === 'high' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                          : p === 'medium' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-600 border-slate-600 text-white shadow-lg shadow-slate-600/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Frequency</label>
                  <select 
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value as Frequency)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Reminder Time</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="enable-reminders"
                    checked={newReminders}
                    onChange={(e) => setNewReminders(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded-lg border-slate-300 focus:ring-indigo-500 cursor-pointer transition-all"
                  />
                </div>
                <label htmlFor="enable-reminders" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  Enable browser reminders
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/30 dark:shadow-none transition-all hover:-translate-y-0.5"
                >
                  Start Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
