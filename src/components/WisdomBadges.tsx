import React from 'react';
import { 
  Shield, 
  Heart, 
  Search, 
  Flame, 
  Wind, 
  TrendingUp,
  Lock,
  Award
} from 'lucide-react';
import { Badge, DayLog } from '../types';
import { BADGE_DEFINITIONS } from '../constants';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, any> = {
  Shield,
  Heart,
  Search,
  Flame,
  Wind,
  TrendingUp
};

interface WisdomBadgesProps {
  logs: DayLog[];
}

export default function WisdomBadges({ logs }: WisdomBadgesProps) {
  // Logic to calculate earned badges
  const calculateEarnedBadges = (): Set<string> => {
    const earned = new Set<string>();
    const allDecisions = logs.flatMap(l => l.decisions);
    
    // The Analyst: 10 decisions
    if (allDecisions.length >= 10) earned.add('analyst');
    
    // The Empath: 5 relationship decisions
    const relationshipCount = allDecisions.filter(d => d.category.toLowerCase() === 'relationships').length;
    if (relationshipCount >= 5) earned.add('empath');
    
    // The Honest: 100% regret
    if (allDecisions.some(d => d.regretIntensity === 100)) earned.add('honest');
    
    // Growth Mindset: 5 notes
    const notesCount = allDecisions.filter(d => d.note && d.note.trim().length > 0).length;
    if (notesCount >= 5) earned.add('growth');
    
    // The Stoic: 3 days in a row < 30% regret
    if (logs.length >= 3) {
      const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let streak = 0;
      for (const log of sortedLogs) {
        const avgRegret = log.decisions.length > 0 
          ? log.decisions.reduce((acc, d) => acc + d.regretIntensity, 0) / log.decisions.length 
          : 0;
        if (avgRegret < 30 && log.decisions.length > 0) {
          streak++;
          if (streak >= 3) earned.add('stoic');
        } else {
          streak = 0;
        }
      }
    }

    // Zen Master: 5 days < 20%
    if (logs.length >= 5) {
      const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let streak = 0;
      for (const log of sortedLogs) {
        const avgRegret = log.decisions.length > 0 
          ? log.decisions.reduce((acc, d) => acc + d.regretIntensity, 0) / log.decisions.length 
          : 0;
        if (avgRegret < 20 && log.decisions.length > 0) {
          streak++;
          if (streak >= 5) earned.add('zen');
        } else {
          streak = 0;
        }
      }
    }

    return earned;
  };

  const earnedIds = calculateEarnedBadges();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {BADGE_DEFINITIONS.map((badge) => {
        const isEarned = earnedIds.has(badge.id);
        const Icon = ICON_MAP[badge.icon] || Award;

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isEarned ? { scale: 1.05, rotate: 2 } : {}}
            className={`
              retro-card p-4 flex flex-col items-center text-center gap-2 transition-all
              ${isEarned ? 'bg-white border-black opacity-100' : 'bg-gray-100 border-gray-300 opacity-60'}
            `}
          >
            <div 
              className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 border-black
                ${isEarned ? '' : 'bg-gray-200'}
              `}
              style={{ backgroundColor: isEarned ? badge.color : undefined }}
            >
              {isEarned ? (
                <Icon className={`w-6 h-6 ${badge.color === '#000000' ? 'text-white' : 'text-black'}`} />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
            </div>
            
            <div>
              <h4 className={`text-sm font-display leading-tight ${isEarned ? 'text-black' : 'text-gray-400'}`}>
                {badge.name}
              </h4>
              <p className="text-[10px] leading-tight text-gray-500 mt-1">
                {badge.description}
              </p>
            </div>

            {isEarned && (
              <div className="mt-auto">
                <span className="text-[9px] font-bold bg-brand-yellow px-2 py-0.5 rounded border border-black uppercase">
                  Earned
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
