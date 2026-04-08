import { Badge } from './types';

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'stoic',
    name: 'The Stoic',
    description: 'Log 3 days in a row with average regret below 30%',
    icon: 'Shield',
    color: '#4C22ED'
  },
  {
    id: 'empath',
    name: 'The Empath',
    description: 'Log 5 decisions in the Relationships category',
    icon: 'Heart',
    color: '#F310F6'
  },
  {
    id: 'analyst',
    name: 'The Analyst',
    description: 'Log 10 decisions total',
    icon: 'Search',
    color: '#FDEE88'
  },
  {
    id: 'honest',
    name: 'The Honest',
    description: 'Log a decision with 100% regret intensity',
    icon: 'Flame',
    color: '#FF5733'
  },
  {
    id: 'zen',
    name: 'Zen Master',
    description: 'Maintain an average regret below 20% for 5 days',
    icon: 'Wind',
    color: '#000000'
  },
  {
    id: 'growth',
    name: 'Growth Mindset',
    description: 'Add notes to 5 different decisions',
    icon: 'TrendingUp',
    color: '#FFFFFF'
  }
];
