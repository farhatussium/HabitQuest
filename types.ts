
export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface UserSettings {
  defaultRemindersEnabled: boolean;
  defaultReminderTime: string;
}

export type Frequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  frequency: Frequency;
  preferredTime: string;
  enabled: boolean;
  remindersEnabled: boolean;
  createdAt: string;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  dateEarned: string;
  icon: string;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  last7Days: boolean[];
}

export interface GlobalStats {
  todayCompletionRate: number;
  totalHabits: number;
  completedToday: number;
}
