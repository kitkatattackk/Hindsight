import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Flame,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Sun,
} from 'lucide-react';
import { DayLog } from '../types';
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval, parseISO, eachDayOfInterval } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WeeklyDigestProps {
  logs: DayLog[];
}

interface WeekStats {
  weekStart: Date;
  weekEnd: Date;
  logs: DayLog[];
  avgMood: number;
  avgRegret: number;
  topCategory: string | null;
  toughestDay: string | null;
  totalDecisions: number;
  totalWins: number;
  daysCheckedIn: number;
}

function getWeekStats(weekOffset: number, allLogs: DayLog[]): WeekStats {
  const now = new Date();
  const weekStart = startOfWeek(subWeeks(now, weekOffset), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(subWeeks(now, weekOffset), { weekStartsOn: 1 });

  const weekLogs = allLogs.filter(log => {
    const d = parseISO(log.date);
    return isWithinInterval(d, { start: weekStart, end: weekEnd });
  });

  const allDecisions = weekLogs.flatMap(l => l.decisions);

  const avgMood = weekLogs.length
    ? weekLogs.reduce((s, l) => s + l.moodScore, 0) / weekLogs.length
    : 0;

  const avgRegret = allDecisions.length
    ? allDecisions.reduce((s, d) => s + d.regretIntensity, 0) / allDecisions.length
    : 0;

  // Top category by count
  const catCounts = allDecisions.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategory = Object.keys(catCounts).length
    ? Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  // Toughest day by avg regret
  const dayRegret = weekLogs.reduce((acc, log) => {
    const day = format(parseISO(log.date), 'EEE');
    const avg = log.decisions.length
      ? log.decisions.reduce((s, d) => s + d.regretIntensity, 0) / log.decisions.length
      : 0;
    acc[day] = avg;
    return acc;
  }, {} as Record<string, number>);
  const toughestDay = Object.keys(dayRegret).length
    ? Object.entries(dayRegret).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  const totalWins = weekLogs.reduce((sum, l) => sum + (l.positives?.length ?? 0), 0);

  return {
    weekStart,
    weekEnd,
    logs: weekLogs,
    avgMood: Math.round(avgMood * 10) / 10,
    avgRegret: Math.round(avgRegret),
    topCategory,
    toughestDay,
    totalDecisions: allDecisions.length,
    totalWins,
    daysCheckedIn: weekLogs.length,
  };
}

function MoodFace({ score }: { score: number }) {
  if (score >= 4) return <Smile className="w-5 h-5 text-green-500" />;
  if (score >= 2.5) return <Meh className="w-5 h-5 text-brand-yellow" />;
  return <Frown className="w-5 h-5 text-brand-pink" />;
}

function DayDots({ weekStart, weekEnd, logs }: { weekStart: Date; weekEnd: Date; logs: DayLog[] }) {
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const logDates = new Set(logs.map(l => l.date));

  return (
    <div className="flex gap-1.5 items-center">
      {days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const checked = logDates.has(dateStr);
        const log = logs.find(l => l.date === dateStr);
        const isFuture = day > new Date();
        return (
          <div key={dateStr} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-bold transition-colors',
                isFuture
                  ? 'bg-gray-100 text-gray-300 border-gray-200'
                  : checked
                  ? 'bg-brand-purple text-white'
                  : 'bg-white text-black/30'
              )}
            >
              {format(day, 'EEEEE')}
            </div>
            {checked && log && (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: log.moodScore >= 4 ? '#22c55e' : log.moodScore >= 3 ? '#FDEE88' : '#F310F6',
                  border: '1px solid #000',
                }}
              />
            )}
            {!checked && !isFuture && (
              <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WeeklyDigest({ logs }: WeeklyDigestProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [direction, setDirection] = useState(0);

  const current = getWeekStats(weekOffset, logs);
  const previous = getWeekStats(weekOffset + 1, logs);

  const regretDelta = previous.avgRegret > 0
    ? Math.round(((current.avgRegret - previous.avgRegret) / previous.avgRegret) * 100)
    : null;

  const isCurrentWeek = weekOffset === 0;

  const navigate = (dir: number) => {
    setDirection(dir);
    setWeekOffset(o => o - dir);
  };

  const hasData = current.logs.length > 0;

  const weekLabel = isCurrentWeek
    ? 'This Week'
    : weekOffset === 1
    ? 'Last Week'
    : `${format(current.weekStart, 'MMM d')} – ${format(current.weekEnd, 'MMM d')}`;

  return (
    <div className="retro-card bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-purple" />
          <h3 className="text-xl font-display">Weekly Digest</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-brand-purple/10 text-black/40 hover:text-brand-purple transition-colors border-2 border-transparent hover:border-brand-purple/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-2 py-1 bg-brand-purple/10 rounded-lg text-brand-purple min-w-[90px] text-center">
            {weekLabel}
          </span>
          <button
            onClick={() => navigate(1)}
            disabled={isCurrentWeek}
            className={cn(
              'p-1.5 rounded-lg transition-colors border-2 border-transparent',
              isCurrentWeek
                ? 'text-black/20 cursor-not-allowed'
                : 'hover:bg-brand-purple/10 text-black/40 hover:text-brand-purple hover:border-brand-purple/20'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={weekOffset}
          initial={{ opacity: 0, x: direction * -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * 40 }}
          transition={{ duration: 0.2 }}
        >
          {/* Day dots */}
          <div className="mb-5">
            <DayDots weekStart={current.weekStart} weekEnd={current.weekEnd} logs={current.logs} />
            <p className="text-[10px] text-black/40 mt-1.5 font-mono">
              {current.daysCheckedIn}/7 days checked in
            </p>
          </div>

          {!hasData ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
              <p className="font-display text-lg text-black/40">No rituals this week</p>
              <p className="text-xs text-black/30">Check in daily to see your weekly digest.</p>
            </div>
          ) : (
            <>
              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Avg Mood */}
                <div className="bg-brand-yellow/20 rounded-xl border-2 border-black p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MoodFace score={current.avgMood} />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">Avg Mood</p>
                  </div>
                  <p className="text-2xl font-display">{current.avgMood || '–'}<span className="text-sm font-sans text-black/40">/5</span></p>
                </div>

                {/* Avg Regret */}
                <div className="bg-brand-pink/10 rounded-xl border-2 border-black p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-brand-pink" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">Avg Regret</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-display">{current.avgRegret}<span className="text-sm font-sans text-black/40">%</span></p>
                    {regretDelta !== null && (
                      <div className={cn(
                        'flex items-center gap-0.5 text-[10px] font-bold mb-1 px-1.5 py-0.5 rounded-full border',
                        regretDelta < 0
                          ? 'text-green-600 bg-green-50 border-green-200'
                          : regretDelta > 0
                          ? 'text-red-500 bg-red-50 border-red-200'
                          : 'text-black/40 bg-gray-50 border-gray-200'
                      )}>
                        {regretDelta < 0 ? <TrendingDown className="w-3 h-3" /> : regretDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {Math.abs(regretDelta)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Category */}
                <div className="bg-brand-purple/5 rounded-xl border-2 border-black p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="w-4 h-4 text-brand-purple" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">Top Category</p>
                  </div>
                  <p className="text-base font-display truncate">{current.topCategory || '–'}</p>
                </div>

                {/* Toughest Day */}
                <div className="bg-white rounded-xl border-2 border-black p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="w-4 h-4 text-black/40" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">Toughest Day</p>
                  </div>
                  <p className="text-base font-display">{current.toughestDay || '–'}</p>
                </div>
              </div>

              {/* Wins this week */}
              <div className="bg-emerald-50 rounded-xl border-2 border-black p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-emerald-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">Wins This Week</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-display text-emerald-600">{current.totalWins}</p>
                  {current.totalWins > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(current.totalWins, 5) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                      ))}
                      {current.totalWins > 5 && (
                        <span className="text-[10px] font-bold text-emerald-500 ml-0.5">+{current.totalWins - 5}</span>
                      )}
                    </div>
                  )}
                  {current.totalWins === 0 && (
                    <span className="text-[10px] text-black/30 font-medium">Log some wins!</span>
                  )}
                </div>
              </div>

              {/* Narrative */}
              <div className="bg-brand-purple text-white rounded-xl border-2 border-black p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Molly's Take</p>
                <p className="text-sm leading-relaxed">
                  {current.daysCheckedIn >= 5
                    ? `Solid week — you checked in ${current.daysCheckedIn} out of 7 days. `
                    : `You checked in ${current.daysCheckedIn} day${current.daysCheckedIn !== 1 ? 's' : ''} this week. Consistency is key! `}
                  {current.totalWins > 0
                    ? `You logged ${current.totalWins} win${current.totalWins !== 1 ? 's' : ''} — don't forget to celebrate those. `
                    : 'Try logging some wins next week — the good stuff matters too. '}
                  {regretDelta !== null && regretDelta < -5
                    ? `Regret is down ${Math.abs(regretDelta)}% vs last week — real growth. `
                    : regretDelta !== null && regretDelta > 10
                    ? `Regret crept up ${regretDelta}% this week. ${current.topCategory ? `Watch those ${current.topCategory.toLowerCase()} decisions.` : ''} `
                    : current.topCategory
                    ? `${current.topCategory} decisions are on your mind most. Worth reflecting on. `
                    : ''}
                  {current.toughestDay ? `${current.toughestDay}s seem to be your hardest day.` : ''}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
