import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Smile,
  Frown,
  Meh,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Decision, DayLog, UserProfile } from '../types';
import { format } from 'date-fns';
import MollyCharacter, { MollyExpression } from './MollyCharacter';
import { haptic } from '../utils/haptics';

interface CheckInRitualProps {
  onClose: () => void;
  onSave: (log: DayLog) => void;
  onUpdateLog?: (log: DayLog) => void;
  pastLogs?: DayLog[];
  categories: string[];
  user: UserProfile;
}

const INTENSITY_LEVELS = [
  { label: 'A little',  value: 20, color: 'bg-green-400',    activeRing: 'ring-green-500'  },
  { label: 'Somewhat',  value: 55, color: 'bg-brand-yellow', activeRing: 'ring-yellow-400' },
  { label: 'A lot',     value: 85, color: 'bg-brand-pink',   activeRing: 'ring-pink-500'   },
] as const;

export default function CheckInRitual({
  onClose, onSave, onUpdateLog, pastLogs = [], categories, user,
}: CheckInRitualProps) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(3);
  const [decisions, setDecisions] = useState<Partial<Decision>[]>([]);
  const [text, setText] = useState('');
  const [intensity, setIntensity] = useState(55);
  const [category, setCategory] = useState(categories[0] || 'Other');
  const [mollyExpression, setMollyExpression] = useState<MollyExpression>(user.mollyExpression);
  const [mollyBounce, setMollyBounce] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);

  const pastDecisionToRevisit = React.useMemo(() => {
    const all = pastLogs.flatMap(l => l.decisions);
    if (!all.length) return null;
    const candidates = all.filter(d => d.regretIntensity > 50 && !d.revisitNote);
    const pool = candidates.length ? candidates : all;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [pastLogs]);

  const [pastRevisitNote, setPastRevisitNote] = useState('');

  const canAdd = text.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    haptic.medium();
    setDecisions(prev => [
      ...prev,
      { id: `new-${Date.now()}`, text: text.trim(), regretIntensity: intensity, category, timestamp: Date.now() },
    ]);
    setText('');
    setIntensity(55);
    setCategory(categories[0] || 'Other');
    setMollyExpression('happy');
    setMollyBounce(true);
    setTimeout(() => { setMollyExpression(user.mollyExpression); setMollyBounce(false); }, 1800);
    setTimeout(() => textRef.current?.focus(), 50);
  };

  const handleComplete = () => {
    haptic.success();
    if (pastDecisionToRevisit && pastRevisitNote && onUpdateLog) {
      const logToUpdate = pastLogs.find(l => l.decisions.some(d => d.id === pastDecisionToRevisit.id));
      if (logToUpdate) {
        onUpdateLog({
          ...logToUpdate,
          decisions: logToUpdate.decisions.map(d =>
            d.id === pastDecisionToRevisit.id ? { ...d, revisitNote: pastRevisitNote } : d
          ),
        });
      }
    }
    onSave({
      id: `log-${Date.now()}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      moodScore: mood,
      decisions: decisions as Decision[],
    });
  };

  const goNext = () => { haptic.light(); setStep(s => s + 1); };
  const goBack = () => { haptic.light(); setStep(s => s - 1); };

  const totalSteps = pastDecisionToRevisit ? 4 : 3;
  // map logical step to progress step
  const progressStep = step === 4 ? totalSteps : step;

  return (
    <div className="absolute inset-0 z-[100] flex items-end justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.28 }}
        style={{ willChange: 'transform' }}
        className="w-full h-full bg-white flex flex-col border-4 border-black shadow-retro overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 shrink-0">
          <motion.div
            className="h-full bg-brand-pink"
            animate={{ width: `${(progressStep / totalSteps) * 100}%` }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Mood ── */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="flex flex-col min-h-full px-6 pt-14 pb-8 gap-8"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <MollyCharacter size={80} expression={user.mollyExpression} color={user.mollyColor} />
                  <h2 className="text-3xl font-display text-brand-purple mt-2">How was your day?</h2>
                  <p className="text-sm text-black/50">Give it an honest rating.</p>
                </div>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => { setMood(score); haptic.light(); }}
                      className={`w-14 h-14 rounded-2xl border-4 border-black flex items-center justify-center transition-all ${
                        mood === score ? 'bg-brand-yellow shadow-retro scale-110' : 'bg-white hover:bg-brand-yellow/20'
                      }`}
                    >
                      {score <= 2 && <Frown className={`w-7 h-7 ${score === 2 ? 'opacity-60' : ''}`} />}
                      {score === 3 && <Meh className="w-7 h-7" />}
                      {score >= 4 && <Smile className={`w-7 h-7 ${score === 4 ? 'opacity-60' : ''}`} />}
                    </button>
                  ))}
                </div>

                <div className="mt-auto">
                  <button onClick={goNext} className="retro-button w-full flex items-center justify-center gap-2">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Log regrets ── */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="flex flex-col min-h-full px-6 pt-14 pb-8 gap-6"
              >
                {/* Header */}
                <div className="text-center space-y-1">
                  <motion.div
                    animate={mollyBounce ? { y: [0, -12, 0] } : {}}
                    transition={{ type: 'tween', ease: 'easeOut', duration: 0.35 }}
                    className="inline-block"
                  >
                    <MollyCharacter size={48} expression={mollyExpression} color={user.mollyColor} />
                  </motion.div>
                  <h2 className="text-2xl font-display text-brand-purple">Any regrets?</h2>
                  <p className="text-xs text-black/50">Log the decisions weighing on you.</p>
                </div>

                {/* Logged decisions */}
                <AnimatePresence>
                  {decisions.map((d) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-brand-yellow/30 border-2 border-black rounded-2xl px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{d.text}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-black/50">{d.category}</span>
                          <span className="text-[10px] font-bold text-black/40">·</span>
                          <span className={`text-[10px] font-bold ${
                            d.regretIntensity! < 40 ? 'text-green-600' :
                            d.regretIntensity! < 70 ? 'text-yellow-600' : 'text-pink-600'
                          }`}>
                            {d.regretIntensity! < 40 ? 'A little' : d.regretIntensity! < 70 ? 'Somewhat' : 'A lot'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDecisions(prev => prev.filter(x => x.id !== d.id))}
                        className="text-black/30 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add form — hidden once 3 added */}
                {decisions.length < 3 && (
                  <div className="space-y-4 bg-gray-50 rounded-2xl border-2 border-black/10 p-4">
                    {/* Text input */}
                    <input
                      ref={textRef}
                      type="text"
                      placeholder="What's weighing on you?"
                      className="retro-input w-full py-3 text-base"
                      value={text}
                      onChange={e => setText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAdd()}
                      autoFocus
                    />

                    {/* Intensity */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">How much regret?</p>
                      <div className="grid grid-cols-3 gap-2">
                        {INTENSITY_LEVELS.map(lvl => (
                          <button
                            key={lvl.value}
                            onClick={() => setIntensity(lvl.value)}
                            className={`py-2.5 rounded-xl border-2 border-black font-bold text-sm transition-all ${
                              intensity === lvl.value
                                ? `${lvl.color} shadow-retro-sm scale-[1.03]`
                                : 'bg-white hover:bg-gray-100'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category chips */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Category</p>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3 py-1 rounded-full border-2 border-black text-xs font-bold transition-all ${
                              category === cat
                                ? 'bg-brand-purple text-white shadow-retro-sm'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={handleAdd}
                      disabled={!canAdd}
                      className="retro-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Log it
                    </button>
                  </div>
                )}

                {/* Nav */}
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={goBack}
                    className="retro-button bg-white text-black hover:bg-gray-100 px-4 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { haptic.light(); setStep(pastDecisionToRevisit ? 3 : 4); }}
                    disabled={decisions.length === 0}
                    className="retro-button flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {decisions.length === 0 ? 'Skip' : 'Continue'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Perspective (past decision) ── */}
            {step === 3 && pastDecisionToRevisit && (
              <motion.div
                key="s3"
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="flex flex-col min-h-full px-6 pt-14 pb-8 gap-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-display text-brand-purple">Looking back</h2>
                  <p className="text-xs text-black/50">How does this past decision feel now?</p>
                </div>

                <div className="retro-card bg-brand-yellow/10 border-dashed space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold border-2 border-black rounded-full px-2 py-0.5 bg-white">
                      {pastDecisionToRevisit.category}
                    </span>
                    <span className="text-[10px] font-mono text-black/40">
                      {format(pastDecisionToRevisit.timestamp, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="font-bold text-base">"{pastDecisionToRevisit.text}"</p>
                  <textarea
                    autoFocus
                    placeholder="What do you think now? Has your perspective changed?"
                    className="retro-input w-full min-h-[110px] text-sm resize-none"
                    value={pastRevisitNote}
                    onChange={e => setPastRevisitNote(e.target.value)}
                  />
                </div>

                <div className="mt-auto flex gap-3">
                  <button onClick={goBack} className="retro-button bg-white text-black hover:bg-gray-100 px-4 flex items-center">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => { haptic.light(); setStep(4); }} className="retro-button flex-1 flex items-center justify-center gap-2">
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Complete ── */}
            {step === 4 && (
              <motion.div
                key="s4"
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                className="flex flex-col min-h-full px-6 pt-14 pb-8 gap-6 text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <MollyCharacter size={100} expression="happy" color={user.mollyColor} />
                  <h2 className="text-3xl font-display text-brand-purple">Ritual complete</h2>
                  <p className="text-sm text-black/50 max-w-xs">
                    You showed up for yourself today. That's what matters.
                  </p>
                </div>

                {/* Summary */}
                {decisions.length > 0 && (
                  <div className="text-left space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Today you logged</p>
                    {decisions.map(d => (
                      <div key={d.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-black/5">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          d.regretIntensity! < 40 ? 'bg-green-400' :
                          d.regretIntensity! < 70 ? 'bg-yellow-400' : 'bg-brand-pink'
                        }`} />
                        <p className="text-sm font-medium truncate">{d.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-brand-purple/5 rounded-2xl border-2 border-dashed border-brand-purple/20 p-4">
                  <p className="italic text-brand-purple text-sm font-medium">
                    "The only real mistake is the one from which we learn nothing."
                  </p>
                </div>

                <div className="mt-auto">
                  <button onClick={handleComplete} className="retro-button w-full flex items-center justify-center gap-2">
                    Save <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
