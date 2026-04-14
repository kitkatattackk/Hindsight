import { MollyExpression } from './components/MollyCharacter';

export type Category = string;

export interface Decision {
  id: string;
  text: string;
  regretIntensity: number; // 0-100
  category: Category;
  regretReason?: string;
  note?: string;
  revisitNote?: string;
  timestamp: number;
}

export interface DayLog {
  id: string;
  date: string; // ISO format
  moodScore: number; // 1-5
  decisions: Decision[];
}

export interface CategoryReminder {
  id: string;
  categoryId: string;
  time: string;
  enabled: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  earnedAt?: number;
}

export interface UserProfile {
  name: string;
  notificationTime: string; // e.g. "21:00"
  categories: Category[];
  hasCompletedOnboarding: boolean;
  mollyExpression: MollyExpression;
  mollyColor: string;
  notificationsEnabled: boolean;
  categoryReminders: CategoryReminder[];
}
