
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Habit, Completion, Frequency, Achievement } from './types';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Auth from './components/Auth';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);

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

  const addHabit = (name: string, frequency: Frequency, time: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: user?.id || 'guest',
      name,
      frequency,
      preferredTime: time,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  return (
    <Layout 
      user={user} 
      onNavigate={setCurrentPage} 
      activePage={currentPage}
      onLogout={handleLogout}
    >
      {currentPage === 'dashboard' ? (
        <Dashboard 
          habits={habits} 
          completions={completions} 
          onAdd={addHabit}
          onDelete={deleteHabit}
          onToggle={toggleCompletion}
        />
      ) : (
        <Analytics habits={habits} completions={completions} />
      )}
    </Layout>
  );
};

export default App;
