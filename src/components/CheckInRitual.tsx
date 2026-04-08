import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Smile, 
  Frown, 
  Meh, 
  CheckCircle2, 
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Maximize2,
  Edit2,
  Clock
} from 'lucide-react';
import { Category, Decision, DayLog, UserProfile } from '../types';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MollyCharacter, { MollyExpression } from './MollyCharacter';
import { haptic } from '../utils/haptics';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CheckInRitualProps {
  onClose: () => void;
  onSave: (log: DayLog) => void;
  onUpdateLog?: (log: DayLog) => void;
  pastLogs?: DayLog[];
  categories: Category[];
  user: UserProfile;
}

export default function CheckInRitual({ onClose, onSave, onUpdateLog, pastLogs = [], categories, user }: CheckInRitualProps) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number>(3);
  const [decisions, setDecisions] = useState<Partial<Decision>[]>([]);
  const [currentDecision, setCurrentDecision] = useState<Partial<Decision>>({
    text: '',
    regretIntensity: 50,
    category: categories[0] || 'Impulse',
    regretReason: '',
    note: '',
    revisitNote: ''
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [mollyExpression, setMollyExpression] = useState<MollyExpression>(user.mollyExpression);
  const [mollyBounce, setMollyBounce] = useState(false);

  // Select a random past decision to revisit
  const pastDecisionToRevisit = React.useMemo(() => {
    if (pastLogs.length === 0) return null;
    const allPastDecisions = pastLogs.flatMap(log => log.decisions);
    if (allPastDecisions.length === 0) return null;
    // Filter for decisions with high regret or no revisit note
    const candidates = allPastDecisions.filter(d => d.regretIntensity > 50 && !d.revisitNote);
    const pool = candidates.length > 0 ? candidates : allPastDecisions;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [pastLogs]);

  const [pastRevisitNote, setPastRevisitNote] = useState('');

  const handleAddDecision = () => {
    if (currentDecision.text) {
      haptic.medium();
      setDecisions([...decisions, { ...currentDecision, id: `new-${Date.now()}`, timestamp: Date.now() }]);
      setCurrentDecision({
        text: '',
        regretIntensity: 50,
        category: categories[0] || 'Impulse',
        regretReason: '',
        note: '',
        revisitNote: ''
      });
      
      // Positive reinforcement animation
      setMollyExpression('happy');
      setMollyBounce(true);
      setTimeout(() => {
        setMollyExpression(user.mollyExpression);
        setMollyBounce(false);
      }, 2000);
    }
  };

  const handleUpdateDecisionNote = (id: string, note: string) => {
    setDecisions(decisions.map(d => d.id === id ? { ...d, revisitNote: note } : d));
  };

  const handleRemoveDecision = (id: string) => {
    setDecisions(decisions.filter(d => d.id !== id));
  };

  const handleComplete = () => {
    haptic.success();
    // Save the past decision reflection if it was updated
    if (pastDecisionToRevisit && pastRevisitNote && onUpdateLog) {
      const logToUpdate = pastLogs.find(log => 
        log.decisions.some(d => d.id === pastDecisionToRevisit.id)
      );
      if (logToUpdate) {
        const updatedDecisions = logToUpdate.decisions.map(d => 
          d.id === pastDecisionToRevisit.id ? { ...d, revisitNote: pastRevisitNote } : d
        );
        onUpdateLog({ ...logToUpdate, decisions: updatedDecisions });
      }
    }

    const finalLog: DayLog = {
      id: `log-${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      moodScore: mood,
      decisions: decisions as Decision[]
    };
    onSave(finalLog);
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-brand-purple/40">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.28 }}
        style={{ willChange: 'transform' }}
        className="retro-card w-full h-full bg-white relative overflow-hidden flex flex-col"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 z-20">
          <motion.div 
            className="h-full bg-brand-pink"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 overflow-y-auto pt-12 pb-8 px-4 md:px-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-display text-brand-purple">How was your day?</h2>
                  <p className="text-sm sm:text-base text-black/60">Take a deep breath. Let's reflect on the mood of your day.</p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => { setMood(score); haptic.light(); }}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-black transition-all flex items-center justify-center ${
                        mood === score ? 'bg-brand-yellow shadow-retro scale-110' : 'bg-white hover:bg-brand-yellow/20'
                      }`}
                    >
                      {score === 1 && <Frown className="w-6 h-6 sm:w-8 sm:h-8" />}
                      {score === 2 && <Frown className="w-6 h-6 sm:w-8 sm:h-8 opacity-50" />}
                      {score === 3 && <Meh className="w-6 h-6 sm:w-8 sm:h-8" />}
                      {score === 4 && <Smile className="w-6 h-6 sm:w-8 sm:h-8 opacity-50" />}
                      {score === 5 && <Smile className="w-6 h-6 sm:w-8 sm:h-8" />}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => { haptic.light(); setStep(2); }}
                  className="retro-button w-full flex items-center justify-center gap-2"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center relative">
                  <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 pointer-events-none">
                    <motion.div
                      animate={mollyBounce ? { y: [0, -14, 0] } : {}}
                      transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
                      style={{ willChange: 'transform' }}
                    >
                      <MollyCharacter 
                        size={50} 
                        expression={mollyExpression} 
                        color={user.mollyColor}
                        className="opacity-80 sm:w-[60px] sm:h-[60px]"
                      />
                    </motion.div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display text-brand-purple">Any regrets today?</h2>
                  <p className="text-sm sm:text-base text-black/60">Log 1-3 decisions that are weighing on you. Be honest with yourself.</p>
                </div>

                <div className="space-y-4">
                  {decisions.map((d) => (
                    <div key={d.id} className="space-y-3 bg-brand-yellow/20 border-2 border-black border-dashed p-3 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{d.text}</p>
                          <p className="text-xs text-black/50">{d.category} • {d.regretIntensity}% regret</p>
                          {d.regretReason && <p className="text-[10px] italic text-black/40 mt-1">Reason: {d.regretReason}</p>}
                        </div>
                        <button onClick={() => handleRemoveDecision(d.id!)} className="text-brand-pink hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Revisit Note Section */}
                      <div className="pt-2 border-t border-black/10">
                        {editingNoteId === d.id ? (
                          <div className="space-y-2">
                            <textarea
                              autoFocus
                              className="retro-input w-full text-xs min-h-[60px] resize-none"
                              value={d.revisitNote || ''}
                              onChange={(e) => handleUpdateDecisionNote(d.id!, e.target.value)}
                              placeholder="How do you feel about this now?"
                            />
                            <button 
                              onClick={() => setEditingNoteId(null)}
                              className="text-[10px] font-bold bg-black text-white px-3 py-1 rounded-lg uppercase"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <button 
                              onClick={() => setEditingNoteId(d.id!)}
                              className="text-[10px] font-bold text-brand-purple flex items-center gap-1 hover:underline uppercase tracking-wider"
                            >
                              <Edit2 className="w-3 h-3" /> {d.revisitNote ? 'Update Reflection' : 'Add Initial Reflection'}
                            </button>
                            {d.revisitNote && (
                              <p className="text-xs italic text-black/60">"{d.revisitNote}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {decisions.length < 3 && (
                    <div className="space-y-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border-2 border-black/5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider">What did you decide?</label>
                        <input 
                          type="text"
                          placeholder="e.g., Bought that expensive gadget"
                          className="retro-input w-full py-3"
                          value={currentDecision.text}
                          onChange={(e) => setCurrentDecision({ ...currentDecision, text: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider">Category</label>
                          <select 
                            className="retro-input w-full text-sm"
                            value={currentDecision.category}
                            onChange={(e) => setCurrentDecision({ ...currentDecision, category: e.target.value })}
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-wider">Regret Intensity</label>
                            <motion.span 
                              key={currentDecision.regretIntensity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className={cn(
                                "text-xs font-bold px-2 py-0.5 rounded border-2 border-black shadow-retro-sm",
                                currentDecision.regretIntensity! < 30 ? "bg-green-400" : 
                                currentDecision.regretIntensity! < 70 ? "bg-brand-yellow" : "bg-brand-pink text-white"
                              )}
                            >
                              {currentDecision.regretIntensity}%
                            </motion.span>
                          </div>
                          <div className="relative pt-2">
                            <input 
                              type="range"
                              className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-black border-2 border-black shadow-retro-sm"
                              style={{
                                background: `linear-gradient(to right, #4ade80 0%, #fdee88 50%, #f310f6 100%)`
                              }}
                              value={currentDecision.regretIntensity}
                              onChange={(e) => setCurrentDecision({ ...currentDecision, regretIntensity: parseInt(e.target.value) })}
                            />
                            <div className="flex justify-between px-1 mt-1">
                              {[0, 25, 50, 75, 100].map(tick => (
                                <div key={tick} className="w-0.5 h-1.5 bg-black/20 rounded-full" />
                              ))}
                            </div>
                            <div className="flex justify-between mt-1 px-1">
                              <span className="text-[10px] font-bold text-black/40 uppercase">Low</span>
                              <span className="text-[10px] font-bold text-black/40 uppercase">Moderate</span>
                              <span className="text-[10px] font-bold text-black/40 uppercase">Heavy</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider">Why this regret? (Optional)</label>
                          <input 
                            type="text"
                            placeholder="Briefly, what's the main reason?"
                            className="retro-input w-full text-sm py-3"
                            value={currentDecision.regretReason || ''}
                            onChange={(e) => setCurrentDecision({ ...currentDecision, regretReason: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-wider">Optional Note</label>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-black/30 uppercase">
                            <Maximize2 className="w-3 h-3" />
                            Expandable
                          </div>
                        </div>
                        <textarea 
                          placeholder="Any extra context or thoughts?"
                          className="retro-input w-full min-h-[100px] text-sm resize-y py-3"
                          value={currentDecision.note}
                          onChange={(e) => setCurrentDecision({ ...currentDecision, note: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-wider">Initial Reflection</label>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-black/30 uppercase">
                            <Clock className="w-3 h-3" />
                            Future You will see this
                          </div>
                        </div>
                        <textarea 
                          placeholder="How do you feel about this decision right now? (Optional)"
                          className="retro-input w-full min-h-[60px] text-sm resize-none"
                          value={currentDecision.revisitNote}
                          onChange={(e) => setCurrentDecision({ ...currentDecision, revisitNote: e.target.value })}
                        />
                      </div>

                      <button 
                        onClick={handleAddDecision}
                        disabled={!currentDecision.text}
                        className="w-full py-2 border-2 border-black border-dashed rounded-xl flex items-center justify-center gap-2 hover:bg-brand-purple/10 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" /> Add Decision
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="retro-button bg-white text-black hover:bg-gray-100 flex-1 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button 
                    onClick={() => { haptic.light(); setStep(pastDecisionToRevisit ? 3 : 4); }}
                    disabled={decisions.length === 0}
                    className="retro-button flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {pastDecisionToRevisit ? 'Next: Reflect' : 'Review'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && pastDecisionToRevisit && (
              <motion.div
                key="step3"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl sm:text-4xl font-display text-brand-purple">Perspective</h2>
                  <p className="text-sm sm:text-base text-black/60">Looking back at a past regret. How does it feel now?</p>
                </div>

                <div className="retro-card bg-brand-yellow/10 border-dashed">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-black bg-white">
                      {pastDecisionToRevisit.category}
                    </span>
                    <span className="text-[10px] font-mono text-black/50">
                      {format(pastDecisionToRevisit.timestamp, 'MMM do, yyyy')}
                    </span>
                  </div>
                  <p className="text-lg font-bold mb-4">"{pastDecisionToRevisit.text}"</p>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Your Reflection</label>
                    <textarea 
                      autoFocus
                      placeholder="Has your intensity changed? What did you learn?"
                      className="retro-input w-full min-h-[120px] text-sm resize-none"
                      value={pastRevisitNote}
                      onChange={(e) => setPastRevisitNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="retro-button bg-white text-black hover:bg-gray-100 flex-1 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button 
                    onClick={() => { haptic.light(); setStep(4); }}
                    className="retro-button flex-1 flex items-center justify-center gap-2 shadow-retro active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                  >
                    Final Step <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="space-y-8 text-center"
              >
                <div className="flex justify-center">
                  <MollyCharacter 
                    size={120} 
                    expression="happy" 
                    color={user.mollyColor}
                    className="animate-bounce" 
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-display text-brand-purple">Ritual Complete</h2>
                  <p className="text-sm sm:text-base text-black/60">
                    You've acknowledged your day. By logging these, you're taking the first step toward understanding your patterns.
                  </p>
                </div>

                <div className="bg-brand-purple/5 p-4 rounded-2xl border-2 border-black border-dashed">
                  <p className="italic text-brand-purple font-medium">
                    "The only real mistake is the one from which we learn nothing."
                  </p>
                </div>

                <button 
                  onClick={handleComplete}
                  className="retro-button w-full flex items-center justify-center gap-2"
                >
                  Save & Rest <CheckCircle2 className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
