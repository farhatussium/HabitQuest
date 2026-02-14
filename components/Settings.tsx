
import React from 'react';
import { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const handleToggleReminders = () => {
    onUpdateSettings({
      ...settings,
      defaultRemindersEnabled: !settings.defaultRemindersEnabled
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      defaultReminderTime: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your global habit preferences and account settings.</p>
      </header>

      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 space-y-8 transition-colors">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="text-indigo-500">🔔</span> New Habit Defaults
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            These settings will be applied automatically whenever you create a new habit.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Enable Reminders</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Suggest browser notifications for new habits</p>
              </div>
              <button 
                onClick={handleToggleReminders}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.defaultRemindersEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.defaultRemindersEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Default Time</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pre-set reminder time for new entries</p>
              </div>
              <input 
                type="time" 
                value={settings.defaultReminderTime}
                onChange={handleTimeChange}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm">
            <span>ℹ️</span>
            <p>Settings are saved automatically to your local browser storage.</p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Account Storage</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Your data is currently stored locally in this browser. To clear everything and start fresh, use the button below.
        </p>
        <button 
          onClick={() => {
            if(window.confirm("Warning: This will delete all your habits and completion history forever. Continue?")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="px-6 py-3 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold transition-colors"
        >
          Clear All Local Data
        </button>
      </section>
    </div>
  );
};

export default Settings;
