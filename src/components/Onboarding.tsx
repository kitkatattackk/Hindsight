import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight,
  User,
  Plus
} from 'lucide-react';
import { UserProfile, Category } from '../types';
import MollyCharacter, { MollyExpression } from './MollyCharacter';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [mollyExpression, setMollyExpression] = useState<MollyExpression>('neutral');
  const [mollyColor, setMollyColor] = useState('#FDEE88');
  const [notificationTime, setNotificationTime] = useState('21:00');
  const [categories, setCategories] = useState<Category[]>(['Work', 'Money', 'Relationships', 'Health', 'Impulse', 'Social']);

  const handleComplete = () => {
    onComplete({
      name: name || 'Friend',
      notificationTime,
      categories,
      hasCompletedOnboarding: true,
      mollyExpression,
      mollyColor
    });
  };

  const expressions: MollyExpression[] = ['neutral', 'happy', 'surprised', 'thinking', 'sleepy'];
  const colors = ['#FDEE88', '#F310F6', '#4C22ED', '#FF5733', '#00D1FF', '#7CFF01'];

  const steps = [
    {
      title: "Welcome to Hindsight",
      content: (
        <div className="space-y-6 text-center">
          <div className="relative flex justify-center py-8">
            {/* Custom Molly Animation for Onboarding */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                rotate: [-180, 10, 0], 
                opacity: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 1.5, 
                times: [0, 0.7, 1],
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <MollyCharacter size={160} expression="surprised" />
            </motion.div>
            
            {/* Portal Effect */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              className="absolute inset-0 bg-brand-purple rounded-full blur-3xl -z-10"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-display text-brand-purple">I'm Molly.</h2>
            <p className="text-black/60 text-lg">
              I'm here to help you navigate your regrets and turn them into wisdom.
            </p>
          </div>
          <div className="pt-4">
            <input 
              type="text"
              placeholder="What should I call you?"
              className="retro-input w-full max-w-xs text-center text-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )
    },
    {
      title: "Your Molly",
      content: (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <MollyCharacter size={140} expression={mollyExpression} color={mollyColor} />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-black/40">Expression</p>
              <div className="flex flex-wrap justify-center gap-2">
                {expressions.map(exp => (
                  <button 
                    key={exp}
                    onClick={() => setMollyExpression(exp)}
                    className={cn(
                      "px-3 py-1 rounded-lg border-2 border-black font-bold text-xs capitalize transition-all",
                      mollyExpression === exp ? "bg-brand-purple text-white shadow-retro-sm" : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-black/40">Color</p>
              <div className="flex justify-center gap-3">
                {colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => setMollyColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-black transition-all",
                      mollyColor === c ? "scale-125 shadow-retro-sm" : "hover:scale-110"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Nightly Ritual",
      content: (
        <div className="space-y-6">
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <MollyCharacter size={100} expression="thinking" />
            </motion.div>
          </div>
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-display text-brand-purple">Reflect before rest.</h2>
            <p className="text-black/60">
              Every night, we'll take 2 minutes to log decisions that are weighing on you. 
              Over time, you'll see how these feelings fade.
            </p>
            <div className="retro-card bg-gray-50 border-dashed flex items-center justify-between max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-purple" />
                <span className="font-bold">Reminder Time</span>
              </div>
              <input 
                type="time" 
                className="retro-input py-1 px-2 text-sm"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Categories",
      content: (
        <div className="space-y-6">
          <div className="flex justify-center">
            <MollyCharacter size={80} />
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-display text-brand-purple">What matters?</h2>
              <p className="text-black/60">Select the areas of life you want to track.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['Work', 'Money', 'Relationships', 'Health', 'Impulse', 'Social', 'Career', 'Family'].map((c) => (
                <button 
                  key={c}
                  onClick={() => {
                    if (categories.includes(c)) {
                      setCategories(categories.filter(cat => cat !== c));
                    } else {
                      setCategories([...categories, c]);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl border-2 border-black font-bold text-sm transition-all ${
                    categories.includes(c) ? 'bg-brand-yellow shadow-retro-sm' : 'bg-gray-100 opacity-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-black/40 italic">You can always add custom categories later in settings.</p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start",
      content: (
        <div className="space-y-8 text-center">
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MollyCharacter size={140} expression="surprised" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-display text-brand-purple">You're all set!</h2>
            <p className="text-black/60 text-lg">
              Hindsight is 20/20, but with a little reflection, the future is even clearer.
            </p>
          </div>
          <div className="bg-brand-yellow/20 p-6 rounded-3xl border-4 border-black border-dashed relative overflow-hidden">
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-brand-yellow animate-pulse" />
            <p className="font-display text-xl text-brand-purple">
              "Don't let yesterday take up too much of today."
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="absolute inset-0 z-[200] bg-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-pink/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        className="w-full max-w-lg flex flex-col h-full max-h-[700px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i + 1 ? 'w-8 bg-brand-purple' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step - 1].content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex gap-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="retro-button bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 px-6"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          )}
          <button 
            onClick={() => step === steps.length ? handleComplete() : setStep(step + 1)}
            disabled={step === 1 && !name.trim()}
            className="retro-button flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {step === steps.length ? 'Get Started' : 'Continue'} 
            {step === steps.length ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
