import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, BookOpen, Settings, PlusCircle, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import MollyCharacter from './MollyCharacter';
import { UserProfile } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  onCheckIn: () => void;
  user: UserProfile;
}

export default function Layout({ children, onCheckIn, user }: LayoutProps) {
  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* Decorative elements */}
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-pink/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center bg-brand-yellow/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MollyCharacter 
            size={36} 
            className="w-[36px] h-[36px]" 
            expression={user.mollyExpression}
            color={user.mollyColor}
          />
          <h1 className="text-xl font-display tracking-tight">HINDSIGHT</h1>
        </div>
        
        <button 
          onClick={onCheckIn}
          className="retro-button flex items-center gap-2 py-1.5 px-3 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ritual</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 px-4 pb-32 overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
