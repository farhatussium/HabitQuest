
import React, { useState, useEffect } from 'react';
import { Habit, Completion, Frequency, UserSettings } from '../types';
import HabitCard from './HabitCard';
import ProgressRing from './ProgressRing';
import InsightPanel from './InsightPanel';

interface DashboardProps {
  habits: Habit[];
  completions: Completion[];
  onAdd: (name: string, freq: Frequency, time: string, reminders: boolean) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateReminders: (id: string, enabled: boolean) => void;
  settings: UserSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, completions, onAdd, onDelete, onToggle, onUpdateReminders, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFreq, setNewFreq] = useState<Frequency>('daily');
  const [newTime, setNewTime] = useState(settings.defaultReminderTime);
  const [newReminders, setNewReminders] = useState(settings.defaultRemindersEnabled);

  // Sync modal state with settings when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setNewTime(settings.defaultReminderTime);
      setNewReminders(settings.defaultRemindersEnabled);
    }
  }, [isModalOpen, settings]);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = completions.filter(c => c.date === today).length;
  const progressPercent = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName, newFreq, newTime, newReminders);
      setNewName('');
      setIsModalOpen(false);
    }
  };

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
            habits.map(habit => (
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
              Studies show that checking off habits within the first hour of your preferred time increases consistency by 40%.
            </p>
          </div>
        </div>
      </div>

      {/* New Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/10 transition-colors">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Create New Habit</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Habit Name</label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reminder Time</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <input 
                  type="checkbox" 
                  id="enable-reminders"
                  checked={newReminders}
                  onChange={(e) => setNewReminders(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="enable-reminders" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Enable browser reminders for this habit
                </label>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
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
