
import React, { useMemo } from 'react';
import { Habit, Completion } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area 
} from 'recharts';

interface AnalyticsProps {
  habits: Habit[];
  completions: Completion[];
}

const Analytics: React.FC<AnalyticsProps> = ({ habits, completions }) => {
  // Generate last 7 days chart data
  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = completions.filter(c => c.date === dateStr).length;
      data.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completions: count,
      });
    }
    return data;
  }, [completions]);

  // Habit specific success rates
  const habitPerformance = useMemo(() => {
    return habits.map(h => {
      const totalCompletions = completions.filter(c => c.habitId === h.id).length;
      const creationDate = new Date(h.createdAt);
      const daysActive = Math.max(1, Math.ceil((new Date().getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)));
      return {
        name: h.name,
        rate: Math.min(100, Math.round((totalCompletions / daysActive) * 100)),
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [habits, completions]);

  const achievements = [
    { name: "Early Bird", desc: "5 completions before 9 AM", icon: "🌅", unlocked: true },
    { name: "Week Warrior", desc: "Maintain a 7-day streak", icon: "🗡️", unlocked: completions.length >= 7 },
    { name: "Centurion", desc: "100 total completions", icon: "💯", unlocked: completions.length >= 100 },
    { name: "Perfect Day", desc: "Complete all habits in 1 day", icon: "✨", unlocked: true },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Insights</h2>
        <p className="text-slate-500 dark:text-slate-400">Deep dive into your behavioral patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Weekly Consistency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                  cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="completions" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">Habit Success Rates (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(79, 70, 229, 0.05)'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {habitPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 80 ? '#22c55e' : entry.rate > 50 ? '#4f46e5' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Achievement System</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((badge, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-2xl border transition-all ${
                badge.unlocked 
                ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm' 
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-900 grayscale opacity-60'
              }`}
            >
              <div className="text-4xl mb-4">{badge.icon}</div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">{badge.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{badge.desc}</p>
              {badge.unlocked && <span className="inline-block mt-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded uppercase">Unlocked</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
