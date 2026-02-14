
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Habit, Completion, Frequency, Achievement, UserSettings } from './types';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('hq_settings');
    return saved ? JSON.parse(saved) : {
      defaultRemindersEnabled: true,
      defaultReminderTime: '08:00'
    };
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('hq_dark_mode') === 'true';
  });

  // Load initial data from localStorage (Simulating DB)
  useEffect(() => {
    const savedUser = localStorage.getItem('hq_user');
    const savedHabits = localStorage.getItem('hq_habits');
    const savedCompletions = localStorage.getItem('hq_completions');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedCompletions) setCompletions(JSON.parse(savedCompletions));
    
    setLoading(false);
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (user) localStorage.setItem('hq_user', JSON.stringify(user));
    else localStorage.removeItem('hq_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hq_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('hq_completions', JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem('hq_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Dark Mode Side Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hq_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  // Notification Scheduler Logic
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const today = now.toISOString().split('T')[0];

      habits.forEach(habit => {
        if (habit.remindersEnabled && habit.preferredTime === currentTimeStr) {
          const isDone = completions.some(c => c.habitId === habit.id && c.date === today);
          if (!isDone) {
            // Trigger browser notification
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("HabitQuest Reminder", {
                body: `Time for: ${habit.name}! Stay consistent.`,
                icon: "/favicon.ico" 
              });
            }
          }
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [habits, completions]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addHabit = (name: string, frequency: Frequency, time: string, remindersEnabled: boolean) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: user?.id || 'guest',
      name,
      frequency,
      preferredTime: time,
      enabled: true,
      remindersEnabled,
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);

    // Request notification permission if enabled
    if (remindersEnabled && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const updateHabitReminders = (id: string, enabled: boolean) => {
    setHabits(habits.map(h => h.id === id ? { ...h, remindersEnabled: enabled } : h));
    if (enabled && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setCompletions(completions.filter(c => c.habitId !== id));
  };

  const toggleCompletion = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = completions.findIndex(c => c.habitId === habitId && c.date === today);

    if (existingIndex > -1) {
      const newCompletions = [...completions];
      newCompletions.splice(existingIndex, 1);
      setCompletions(newCompletions);
    } else {
      const newCompletion: Completion = {
        id: crypto.randomUUID(),
        habitId,
        date: today,
        timestamp: new Date().toISOString(),
      };
      setCompletions([...completions, newCompletion]);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            habits={habits} 
            completions={completions} 
            onAdd={addHabit}
            onDelete={deleteHabit}
            onToggle={toggleCompletion}
            onUpdateReminders={updateHabitReminders}
            settings={userSettings}
          />
        );
      case 'analytics':
        return <Analytics habits={habits} completions={completions} />;
      case 'settings':
        return <Settings settings={userSettings} onUpdateSettings={setUserSettings} />;
      default:
        return null;
    }
  };

  return (
    <Layout 
      user={user} 
      onNavigate={setCurrentPage} 
      activePage={currentPage}
      onLogout={handleLogout}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
