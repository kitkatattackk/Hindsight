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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCheckIn: () => void;
  user: UserProfile;
}

export default function Layout({ children, activeTab, setActiveTab, onCheckIn, user }: LayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Insights', icon: LayoutDashboard },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-yellow flex flex-col relative">
      {/* Decorative elements */}
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-pink/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl animate-pulse delay-700" />
      
      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MollyCharacter 
            size={40} 
            className="md:w-[50px] md:h-[50px]" 
            expression={user.mollyExpression}
            color={user.mollyColor}
          />
          <h1 className="text-2xl md:text-3xl font-display tracking-tight">HINDSIGHT</h1>
        </div>
        
        <button 
          onClick={onCheckIn}
          className="retro-button flex items-center gap-2 py-2 px-3 md:px-4 text-sm md:text-lg"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="hidden xs:inline">Nightly Ritual</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 container mx-auto px-4 pb-36 md:pb-12 max-w-4xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 bg-white border-4 border-black shadow-retro-lg rounded-2xl px-2 py-2 flex items-center justify-around md:justify-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl font-display transition-all flex-1 md:flex-none",
              activeTab === tab.id 
                ? "bg-brand-purple text-white" 
                : "hover:bg-brand-purple/10 text-black"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] md:text-base md:inline">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
