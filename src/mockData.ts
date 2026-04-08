import { DayLog, Category, UserProfile } from './types';
import { subDays, format, startOfDay } from 'date-fns';

const categories: Category[] = ['Work', 'Money', 'Relationships', 'Health', 'Impulse', 'Social'];

const generateMockDecisions = (date: Date) => {
  const count = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: count }).map((_, i) => ({
    id: `decision-${date.getTime()}-${i}`,
    text: [
      "Bought that expensive coffee machine",
      "Stayed up late watching Netflix",
      "Didn't speak up in the meeting",
      "Skipped the gym for the third time",
      "Sent a risky text to my ex",
      "Ate a whole pizza by myself",
      "Agreed to extra work on a Friday",
      "Bought crypto at the peak",
      "Ignored a call from my mom",
      "Spent $200 on a skin in a game"
    ][Math.floor(Math.random() * 10)],
    regretIntensity: Math.floor(Math.random() * 101),
    category: categories[Math.floor(Math.random() * categories.length)],
    note: "I should have known better...",
    timestamp: date.getTime(),
    revisitNote: Math.random() > 0.7 ? "Looking back, it wasn't that bad." : undefined
  }));
};

export const mockLogs: DayLog[] = Array.from({ length: 45 }).map((_, i) => {
  const date = subDays(new Date(), i);
  return {
    id: `log-${i}`,
    date: format(date, 'yyyy-MM-dd'),
    moodScore: Math.floor(Math.random() * 5) + 1,
    decisions: generateMockDecisions(date)
  };
});

export const mockUser: UserProfile = {
  name: "Alex",
  notificationTime: "21:30",
  categories: categories,
  hasCompletedOnboarding: false,
  mollyExpression: 'neutral',
  mollyColor: '#FDEE88'
};
