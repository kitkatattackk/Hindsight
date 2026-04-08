import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  PieChart as PieChartIcon, 
  ArrowRight,
  Zap,
  Flame,
  Sparkles,
  BarChart3,
  BrainCircuit,
  Ghost,
  Moon,
  Sun,
  LayoutDashboard,
  CheckCircle2,
  Activity,
  Award
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { DayLog, Category } from '../types';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays, startOfDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MollyCharacter from './MollyCharacter';
import RegretMapping from './RegretMapping';
import WisdomBadges from './WisdomBadges';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  logs: DayLog[];
  onCheckIn: () => void;
}

const EmptyStateIllustration = ({ icon: Icon, title, description, colorClass }: { icon: any, title: string, description: string, colorClass: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
    <motion.div 
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
      className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-black shadow-retro-sm", colorClass)}
    >
      <Icon className="w-8 h-8 text-black" />
    </motion.div>
    <div className="space-y-1">
      <p className="font-display text-lg">{title}</p>
      <p className="text-xs text-black/50 max-w-[200px] leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function Dashboard({ logs, onCheckIn }: DashboardProps) {
  // Calculate category breakdown
  const categoryStats = logs.reduce((acc, log) => {
    log.decisions.forEach(d => {
      acc[d.category] = (acc[d.category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

  // Calculate regret intensity over time (last 30 days)
  const chartDays = 30;
  const regretHistory = Array.from({ length: chartDays }).map((_, i) => {
    const date = format(subDays(new Date(), (chartDays - 1) - i), 'yyyy-MM-dd');
    const log = logs.find(l => l.date === date);
    const avgRegret = log?.decisions.length 
      ? log.decisions.reduce((sum, d) => sum + d.regretIntensity, 0) / log.decisions.length 
      : 0;
    return {
      date: format(subDays(new Date(), (chartDays - 1) - i), 'MMM dd'),
      regret: Math.round(avgRegret)
    };
  });

  const COLORS = ['#4C22ED', '#F310F6', '#FDEE88', '#000000', '#FFFFFF', '#FF5733'];

  // Calculate current streak
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    // Sort logs by date descending just in case
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    
    let streak = 0;
    let currentDate = new Date();
    
    // Check if the most recent log is today or yesterday
    const mostRecentLogDate = parseISO(sortedLogs[0].date);
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(new Date(), 1));
    const logDate = startOfDay(mostRecentLogDate);

    if (logDate.getTime() < yesterday.getTime()) {
      return 0; // Streak broken
    }

    let expectedDate = logDate;
    
    for (const log of sortedLogs) {
      const currentLogDate = startOfDay(parseISO(log.date));
      if (currentLogDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate = subDays(expectedDate, 1);
      } else if (currentLogDate.getTime() < expectedDate.getTime()) {
        break; // Gap found
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();
  const isCheckInCompleteToday = logs.some(l => l.date === format(new Date(), 'yyyy-MM-dd'));

  // Calculate insights
  const insights = React.useMemo(() => {
    if (logs.length < 2) return null;

    const categoryStats = logs.reduce((acc, log) => {
      log.decisions.forEach(d => {
        if (!acc[d.category]) {
          acc[d.category] = { totalIntensity: 0, count: 0 };
        }
        acc[d.category].totalIntensity += d.regretIntensity;
        acc[d.category].count += 1;
      });
      return acc;
    }, {} as Record<string, { totalIntensity: number, count: number }>);

    const averages = Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      avg: stats.totalIntensity / stats.count,
      count: stats.count
    }));

    // Find category with highest average regret
    const topRegret = [...averages].sort((a, b) => b.avg - a.avg)[0];

    // Day of week analysis
    const dayStats = logs.reduce((acc, log) => {
      const day = format(parseISO(log.date), 'EEEE');
      if (!acc[day]) acc[day] = { total: 0, count: 0 };
      const avg = log.decisions.length 
        ? log.decisions.reduce((s, d) => s + d.regretIntensity, 0) / log.decisions.length 
        : 0;
      acc[day].total += avg;
      acc[day].count += 1;
      return acc;
    }, {} as Record<string, { total: number, count: number }>);

    const worstDay = Object.entries(dayStats)
      .map(([name, stats]) => ({ name, avg: stats.total / stats.count }))
      .sort((a, b) => b.avg - a.avg)[0];

    // Mood correlation
    const moodCorrelation = logs.length > 3 ? (() => {
      const lowMoodRegret = logs.filter(l => l.moodScore <= 2)
        .flatMap(l => l.decisions)
        .reduce((acc, d, _, arr) => acc + (d.regretIntensity / arr.length), 0);
      const highMoodRegret = logs.filter(l => l.moodScore >= 4)
        .flatMap(l => l.decisions)
        .reduce((acc, d, _, arr) => acc + (d.regretIntensity / arr.length), 0);
      
      if (lowMoodRegret > highMoodRegret * 1.2) {
        return Math.round(((lowMoodRegret - highMoodRegret) / highMoodRegret) * 100);
      }
      return null;
    })() : null;

    return {
      topRegret: topRegret && topRegret.avg > 40 ? {
        category: topRegret.name,
        avg: Math.round(topRegret.avg),
        message: `Next time you're about to make a ${topRegret.name.toLowerCase()} decision, remember that these tend to stay with you longer (avg. ${Math.round(topRegret.avg)}% regret). Worth a second thought?`
      } : null,
      worstDay: worstDay && worstDay.avg > 30 ? worstDay : null,
      moodCorrelation
    };
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <MollyCharacter size={120} className="animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-4xl font-display">Your journey begins...</h2>
          <p className="text-black/60 max-w-xs mx-auto">
            Log your first nightly ritual to start seeing patterns in your decisions.
          </p>
        </div>
        <button 
          onClick={onCheckIn} 
          className="retro-button"
        >
          Start First Ritual
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header with Streak */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display text-black">Dashboard</h1>
          <p className="text-sm sm:text-base text-black/60">Your emotional patterns at a glance.</p>
        </div>
        
        <div className="flex items-stretch gap-3 w-full md:w-auto">
          {/* Today's Status */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex-1 flex items-center gap-3 border-4 border-black p-3 rounded-2xl shadow-retro-sm transition-colors relative overflow-hidden",
              isCheckInCompleteToday ? "bg-brand-yellow" : "bg-white"
            )}
          >
            {isCheckInCompleteToday && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '250%' }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  ease: "linear",
                  repeatDelay: 3
                }}
                className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
              />
            )}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 border-black shrink-0 relative z-10",
              isCheckInCompleteToday ? "bg-white" : "bg-gray-100"
            )}>
              {isCheckInCompleteToday ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              ) : (
                <Sparkles className="w-6 h-6 text-brand-purple animate-pulse" />
              )}
            </div>
            <div className="min-w-0 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 leading-none truncate">Today's Ritual</p>
              <p className="text-sm font-display leading-tight truncate">
                {isCheckInCompleteToday ? 'Complete!' : 'Pending'}
              </p>
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex items-center gap-3 bg-white border-4 border-black p-3 rounded-2xl shadow-retro-sm"
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 border-black shrink-0",
              streak > 0 ? "bg-brand-yellow" : "bg-gray-100"
            )}>
              <Flame className={cn("w-6 h-6", streak > 0 ? "text-orange-500" : "text-gray-400")} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 leading-none truncate">Current Streak</p>
              <p className="text-xl font-display leading-tight truncate">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Nudge Section */}
      <AnimatePresence>
        {insights?.topRegret && (
          <motion.section 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="retro-card bg-brand-purple text-white border-brand-purple shadow-retro-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Zap className="text-brand-yellow w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display mb-1">A gentle observation...</h2>
                <p className="text-white/90 text-base sm:text-lg">
                  {insights.topRegret.message}
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regret Decay Chart */}
        <div className="retro-card h-[300px] md:h-[350px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-display flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-brand-purple" />
              Regret Decay (30d)
            </h3>
          </div>
          
          <div className="flex-1 w-full opacity-90 relative">
            {logs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={regretHistory} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient id="regretGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4C22ED" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4C22ED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10 }} 
                    interval={6}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '4px solid #000', 
                      borderRadius: '12px',
                      fontFamily: 'Fredoka',
                      fontSize: '12px',
                      boxShadow: '4px 4px 0px rgba(0,0,0,1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="regret" 
                    stroke="#4C22ED" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#regretGradient)"
                    dot={false} 
                    activeDot={{ r: 6, fill: '#F310F6', stroke: '#000', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyStateIllustration 
                icon={BarChart3}
                title="Waiting for Data"
                description="Your regret decay chart will appear here once you start logging rituals."
                colorClass="bg-brand-purple/20"
              />
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="retro-card h-[300px] md:h-[350px] flex flex-col">
          <h3 className="text-lg md:text-xl font-display flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-brand-pink" />
            Regret Categories
          </h3>
          <div className="flex-1 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '4px solid #000', 
                      borderRadius: '12px',
                      fontFamily: 'Fredoka',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={16}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyStateIllustration 
                icon={PieChartIcon}
                title="No Categories Yet"
                description="We'll group your regrets by category to show you where your energy goes."
                colorClass="bg-brand-pink/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Regret Mapping (D3) */}
      <section className="space-y-4">
        <div className="retro-card bg-white min-h-[500px] flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-display flex items-center gap-2">
              <Activity className="w-6 h-6 text-brand-purple" />
              Regret Intensity Mapping
            </h3>
            <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded uppercase tracking-widest opacity-50">D3 Engine</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 flex-1">
            <div className="flex-1">
              {logs.length > 0 ? (
                <RegretMapping logs={logs} />
              ) : (
                <EmptyStateIllustration 
                  icon={BrainCircuit}
                  title="Mapping the Mind"
                  description="This D3-powered chart will visualize which life categories carry the heaviest emotional weight."
                  colorClass="bg-brand-purple/10"
                />
              )}
            </div>
            <div className="md:w-1/3 space-y-4 flex flex-col justify-center">
              <div className="p-4 bg-brand-yellow/20 rounded-xl border-2 border-black border-dashed">
                <p className="text-xs font-bold uppercase tracking-wider text-black/60 mb-1">What is this?</p>
                <p className="text-sm leading-relaxed">
                  This chart maps the <strong>average emotional intensity</strong> of your regrets across different life categories. 
                </p>
              </div>
              <div className="p-4 bg-brand-pink/10 rounded-xl border-2 border-black border-dashed">
                <p className="text-xs font-bold uppercase tracking-wider text-black/60 mb-1">Why it matters</p>
                <p className="text-sm leading-relaxed">
                  High intensity in a specific category often signals a <strong>misalignment</strong> with your core values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wisdom Badges */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-display flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-yellow" />
            Wisdom Badges
          </h3>
          <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded uppercase tracking-widest opacity-50">Achievements</span>
        </div>
        <div className="retro-card bg-brand-purple/5 p-6 border-dashed">
          <WisdomBadges logs={logs} />
        </div>
      </section>

      {/* Pattern Cards */}
      <section className="space-y-4">
        <h3 className="text-2xl font-display">Pattern Recognition</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="retro-card bg-brand-yellow/30 border-dashed min-h-[180px] flex flex-col items-center justify-center text-center">
            {insights?.worstDay ? (
              <>
                <Calendar className="w-8 h-8 text-brand-purple mb-2" />
                <p className="font-bold text-lg">{insights.worstDay.name}</p>
                <p className="text-sm text-black/70">
                  You regret decisions most on {insights.worstDay.name}s.
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <Moon className="w-8 h-8 text-brand-purple/40 mx-auto" />
                <p className="font-bold text-black/40">Toughest Day</p>
                <p className="text-xs text-black/40">Log 2+ rituals to find your toughest day.</p>
              </div>
            )}
          </div>
          <div className="retro-card bg-brand-pink/10 border-dashed min-h-[180px] flex flex-col items-center justify-center text-center">
            {insights?.topRegret ? (
              <>
                <AlertTriangle className="w-8 h-8 text-brand-pink mb-2" />
                <p className="font-bold text-lg">{insights.topRegret.category}</p>
                <p className="text-sm text-black/70">
                  Your {insights.topRegret.category.toLowerCase()} decisions stay with you longer.
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <Ghost className="w-8 h-8 text-brand-pink/40 mx-auto" />
                <p className="font-bold text-black/40">Top Regret</p>
                <p className="text-xs text-black/40">Identify your biggest regret category.</p>
              </div>
            )}
          </div>
          <div className="retro-card bg-white border-dashed min-h-[180px] flex flex-col items-center justify-center text-center">
            {insights?.moodCorrelation ? (
              <>
                <TrendingDown className="w-8 h-8 text-green-500 mb-2" />
                <p className="font-bold text-lg">Mood Correlation</p>
                <p className="text-sm text-black/70">
                  Low mood days lead to {insights.moodCorrelation}% higher regret intensity.
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <BrainCircuit className="w-8 h-8 text-black/20 mx-auto" />
                <p className="font-bold text-black/40">Mood Link</p>
                <p className="text-xs text-black/40">Log 4+ rituals to see mood correlations.</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
