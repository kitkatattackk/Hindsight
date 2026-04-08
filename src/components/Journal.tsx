import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Smile, 
  Frown, 
  Meh, 
  ChevronRight, 
  MessageSquare, 
  Tag, 
  Clock, 
  AlertCircle,
  Edit2,
  Search,
  X as XIcon
} from 'lucide-react';
import { DayLog, Category, Decision } from '../types';
import { format, parseISO } from 'date-fns';

interface JournalProps {
  logs: DayLog[];
  onUpdateLog: (log: DayLog) => void;
}

const MoodIcon = ({ score }: { score: number }) => {
  if (score >= 4) return <Smile className="w-6 h-6 text-green-500" />;
  if (score >= 3) return <Meh className="w-6 h-6 text-brand-yellow" />;
  return <Frown className="w-6 h-6 text-brand-pink" />;
};

const CategoryBadge = ({ category }: { category: Category }) => {
  const colors: Record<string, string> = {
    'Work': 'bg-blue-100 text-blue-600 border-blue-200',
    'Money': 'bg-green-100 text-green-600 border-green-200',
    'Relationships': 'bg-pink-100 text-pink-600 border-pink-200',
    'Health': 'bg-emerald-100 text-emerald-600 border-emerald-200',
    'Impulse': 'bg-purple-100 text-purple-600 border-purple-200',
    'Social': 'bg-orange-100 text-orange-600 border-orange-200',
  };

  const colorClass = colors[category] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>
      {category}
    </span>
  );
};

export default function Journal({ logs, onUpdateLog }: JournalProps) {
  const [editingDecisionId, setEditingDecisionId] = React.useState<string | null>(null);
  const [revisitValue, setRevisitValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredLogs = React.useMemo(() => {
    if (!searchQuery.trim()) return logs;

    const query = searchQuery.toLowerCase();
    return logs.map(log => {
      const matchingDecisions = log.decisions.filter(d => 
        d.text.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        (d.note && d.note.toLowerCase().includes(query)) ||
        (d.regretReason && d.regretReason.toLowerCase().includes(query)) ||
        (d.revisitNote && d.revisitNote.toLowerCase().includes(query))
      );

      if (matchingDecisions.length > 0) {
        return { ...log, decisions: matchingDecisions };
      }
      return null;
    }).filter((log): log is DayLog => log !== null);
  }, [logs, searchQuery]);

  const sortedLogs = [...filteredLogs].sort((a, b) => b.date.localeCompare(a.date));

  const handleStartRevisit = (decision: Decision) => {
    setEditingDecisionId(decision.id);
    setRevisitValue(decision.revisitNote || '');
  };

  const handleSaveRevisit = (log: DayLog, decisionId: string) => {
    const updatedDecisions = log.decisions.map(d => 
      d.id === decisionId ? { ...d, revisitNote: revisitValue } : d
    );
    onUpdateLog({ ...log, decisions: updatedDecisions });
    setEditingDecisionId(null);
    setRevisitValue('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-display">Your Reflection Log</h2>
          <div className="flex items-center gap-2 text-sm text-black/60 font-mono">
            <Calendar className="w-4 h-4" />
            <span>{filteredLogs.length} entries</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
          <input 
            type="text"
            placeholder="Search decisions, categories, or notes..."
            className="retro-input w-full pl-10 pr-10 py-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XIcon className="w-4 h-4 text-black/50" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-6 sm:pl-8 border-l-2 sm:border-l-4 border-black/10"
          >
            {/* Date Marker */}
            <div className="absolute -left-[9px] sm:-left-[14px] top-0 w-4 h-4 sm:w-6 sm:h-6 bg-white border-2 sm:border-4 border-black rounded-full z-10" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display text-brand-purple">
                  {format(parseISO(log.date), 'EEEE, MMM do')}
                </h3>
                <div className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 rounded-lg shadow-retro-sm">
                  <MoodIcon score={log.moodScore} />
                  <span className="font-bold text-sm">{log.moodScore}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {log.decisions.map((decision) => (
                  <div key={decision.id} className="retro-card hover:translate-x-1 transition-transform group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={decision.category} />
                        <span className="text-xs font-mono text-black/50">
                          {format(decision.timestamp, 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden border border-black/10">
                          <div 
                            className="h-full bg-brand-pink" 
                            style={{ width: `${decision.regretIntensity}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold">{decision.regretIntensity}%</span>
                      </div>
                    </div>

                    <p className="text-lg font-bold mb-2 group-hover:text-brand-purple transition-colors">
                      {decision.text}
                    </p>

                    {decision.regretReason && (
                      <p className="text-xs italic text-black/50 mb-3">
                        Reason: {decision.regretReason}
                      </p>
                    )}

                    {decision.note && (
                      <div className="flex gap-2 text-sm text-black/60 bg-brand-yellow/10 p-2 rounded-lg border border-dashed border-black/10">
                        <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="italic">"{decision.note}"</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-black/5">
                      {editingDecisionId === decision.id ? (
                        <div className="space-y-3">
                          <textarea
                            autoFocus
                            placeholder="How do you feel about this decision now?"
                            className="retro-input w-full text-sm min-h-[80px] resize-none"
                            value={revisitValue}
                            onChange={(e) => setRevisitValue(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveRevisit(log, decision.id)}
                              className="bg-brand-purple text-white px-4 py-1 rounded-lg font-bold text-xs border-2 border-black shadow-retro-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                            >
                              Save Reflection
                            </button>
                            <button 
                              onClick={() => setEditingDecisionId(null)}
                              className="bg-white text-black px-4 py-1 rounded-lg font-bold text-xs border-2 border-black hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {decision.revisitNote ? (
                            <div className="flex gap-2 text-sm text-green-600">
                              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Revisited Perspective</p>
                                <p className="font-medium">"{decision.revisitNote}"</p>
                                <button 
                                  onClick={() => handleStartRevisit(decision)}
                                  className="mt-2 text-[10px] font-bold text-black/40 hover:text-brand-purple flex items-center gap-1 uppercase"
                                >
                                  <Edit2 className="w-3 h-3" /> Update Reflection
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleStartRevisit(decision)}
                              className="text-xs font-bold text-brand-purple flex items-center gap-1 hover:underline"
                            >
                              <Edit2 className="w-3 h-3" />
                              Revisit this decision
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="retro-card border-dashed bg-gray-50 flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center border-4 border-black border-dashed">
            <Search className="w-8 h-8 text-brand-purple/40" />
          </div>
          <div className="space-y-1">
            <p className="font-display text-xl">No matches found</p>
            <p className="text-sm text-black/50 max-w-xs">
              We couldn't find any reflections matching "{searchQuery}". Try a different keyword.
            </p>
          </div>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-brand-purple font-bold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
