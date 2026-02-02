
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onNavigate: (page: 'dashboard' | 'analytics') => void;
  activePage: 'dashboard' | 'analytics';
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onNavigate, activePage, onLogout, isDarkMode, onToggleDarkMode, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar / Top Nav */}
      <aside className="w-full md:w-64 bg-indigo-950 text-white flex flex-col sticky top-0 md:h-screen z-20 shadow-xl">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
              H
            </div>
            <h1 className="text-xl font-bold tracking-tight">HabitQuest</h1>
          </div>
          <button 
            onClick={onToggleDarkMode}
            className="md:hidden p-2 rounded-lg bg-indigo-900 hover:bg-indigo-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <nav className="flex-1 mt-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${
              activePage === 'dashboard' ? 'bg-indigo-900 border-l-4 border-indigo-400' : 'hover:bg-indigo-900'
            }`}
          >
            <span className="mr-3 text-lg">🏠</span> <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${
              activePage === 'analytics' ? 'bg-indigo-900 border-l-4 border-indigo-400' : 'hover:bg-indigo-900'
            }`}
          >
            <span className="mr-3 text-lg">📊</span> <span className="font-medium">Analytics</span>
          </button>
        </nav>

        <div className="px-6 py-4 border-t border-indigo-900 hidden md:block">
           <button 
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-indigo-900/50 hover:bg-indigo-900 transition-all text-sm font-medium"
          >
            <span>Appearance</span>
            <span>{isDarkMode ? '☀️ Light' : '🌙 Dark'}</span>
          </button>
        </div>

        <div className="p-6 border-t border-indigo-900">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold text-indigo-950">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs text-indigo-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full transition-colors">
        {children}
      </main>
    </div>
  );
};

export default Layout;
