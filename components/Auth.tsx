
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a premium loading feel
    setTimeout(() => {
      const mockUser: User = {
        id: crypto.randomUUID(),
        name: name || 'Alex Johnson',
        email: email || 'alex@example.com',
        joinedAt: new Date().toISOString()
      };
      onLogin(mockUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-['Inter'] relative overflow-hidden">
      {/* Texture Layer */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-[1]"></div>
      
      {/* Deep Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px] animate-float"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[60%] h-[60%] bg-violet-600/15 rounded-full blur-[140px] animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[30%] right-[15%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className={`w-full max-w-[440px] relative z-10 transition-all duration-1000 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        {/* Glow behind the card */}
        <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        {/* The Card Container */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500/30 to-violet-500/30 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          
          <div className="bg-slate-900/60 backdrop-blur-[32px] border border-white/10 w-full rounded-[2.25rem] p-10 md:p-12 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden">
            
            {/* Header Area */}
            <div className="relative text-center mb-10">
              <div className="flex justify-center mb-8">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-2xl animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl rotate-3 shadow-lg group-hover:rotate-6 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-4xl shadow-inner -rotate-3 group-hover:-rotate-0 transition-transform duration-500">
                    H
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                {isLogin ? 'Welcome' : 'Join Us'}
              </h2>
              <p className="text-slate-400 font-medium text-sm">
                {isLogin ? 'Sign in to your Quest dashboard' : 'Start your journey to mastery'}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2 group/input">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Your Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all duration-300 shadow-inner"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 group/input">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@habitquest.pro"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all duration-300 shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group/input">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Password</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-tight">Recover</button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all duration-300 shadow-inner"
                    required
                  />
                </div>
                {!isLogin && password.length > 0 && (
                  <div className="flex gap-1.5 px-1 mt-3">
                    <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${password.length > 3 ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${password.length > 6 ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${password.length > 9 ? 'bg-indigo-500' : 'bg-white/10'}`}></div>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-5 rounded-[1.25rem] shadow-xl shadow-indigo-600/20 transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-all"></div>
                
                <span className={`relative z-10 flex items-center justify-center gap-3 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  {isLogin ? 'Launch Dashboard' : 'Initiate Membership'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-12 text-center relative">
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <p className="pt-8 text-sm text-slate-400 font-medium">
                {isLogin ? "New to the Quest?" : "Already part of the team?"}{' '}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setName('');
                    setPassword('');
                  }}
                  className="text-white font-bold hover:text-indigo-400 transition-all duration-300 underline underline-offset-8 decoration-indigo-500/30 hover:decoration-indigo-500"
                >
                  {isLogin ? 'Sign up free' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Global Footer Links */}
        <div className="flex justify-center gap-8 mt-10 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-600">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 rounded-full bg-slate-800 self-center"></span>
          <a href="#" className="hover:text-slate-400 transition-colors">Master Terms</a>
          <span className="w-1 h-1 rounded-full bg-slate-800 self-center"></span>
          <a href="#" className="hover:text-slate-400 transition-colors">Cloud Status</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
