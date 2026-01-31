
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onNavigate: (page: 'dashboard' | 'analytics') => void;
  activePage: 'dashboard' | 'analytics';
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onNavigate, activePage, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar / Top Nav */}
      <aside className="w-full md:w-64 bg-indigo-900 text-white flex flex-col sticky top-0 md:h-screen z-10">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
            H
          </div>
          <h1 className="text-xl font-bold tracking-tight">HabitQuest</h1>
        </div>

        <nav className="flex-1 mt-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${
              activePage === 'dashboard' ? 'bg-indigo-800 border-l-4 border-indigo-400' : 'hover:bg-indigo-800'
            }`}
          >
            <span className="mr-3">🏠</span> Dashboard
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${
              activePage === 'analytics' ? 'bg-indigo-800 border-l-4 border-indigo-400' : 'hover:bg-indigo-800'
            }`}
          >
            <span className="mr-3">📊</span> Analytics
          </button>
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold">
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
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
