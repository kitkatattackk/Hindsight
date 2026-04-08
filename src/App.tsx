/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import Settings from './components/Settings';
import CheckInRitual from './components/CheckInRitual';
import Onboarding from './components/Onboarding';
import MobileShell from './components/MobileShell';
import ErrorBoundary from './components/ErrorBoundary';
import { DayLog, UserProfile } from './types';
import { mockLogs, mockUser } from './mockData';

import { LayoutDashboard, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<DayLog[]>(mockLogs);
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Insights', icon: LayoutDashboard },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  // Simulate loading state or initial data fetch
  useEffect(() => {
    const savedLogs = localStorage.getItem('hindsight_logs');
    const savedUser = localStorage.getItem('hindsight_user');
    
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSaveLog = (newLog: DayLog) => {
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('hindsight_logs', JSON.stringify(updatedLogs));
    setIsCheckInOpen(false);
    setActiveTab('journal');
  };

  const handleUpdateLog = (updatedLog: DayLog) => {
    const updatedLogs = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
    setLogs(updatedLogs);
    localStorage.setItem('hindsight_logs', JSON.stringify(updatedLogs));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('hindsight_user', JSON.stringify(updatedUser));
  };

  return (
    <MobileShell>
      <ErrorBoundary>
        {!user.hasCompletedOnboarding ? (
          <Onboarding onComplete={handleUpdateUser} />
        ) : (
          <Layout 
            onCheckIn={() => setIsCheckInOpen(true)}
            user={user}
          >
            <ErrorBoundary>
              {activeTab === 'dashboard' && <Dashboard logs={logs} onCheckIn={() => setIsCheckInOpen(true)} />}
              {activeTab === 'journal' && <Journal logs={logs} onUpdateLog={handleUpdateLog} />}
              {activeTab === 'settings' && <Settings user={user} onUpdateUser={handleUpdateUser} />}
            </ErrorBoundary>

            <AnimatePresence>
              {isCheckInOpen && (
                <ErrorBoundary>
                  <CheckInRitual 
                    onClose={() => setIsCheckInOpen(false)} 
                    onSave={handleSaveLog}
                    onUpdateLog={handleUpdateLog}
                    pastLogs={logs}
                    categories={user.categories}
                    user={user}
                  />
                </ErrorBoundary>
              )}
            </AnimatePresence>
          </Layout>
        )}

        {/* Floating Bottom Navigation - Always visible if onboarding is done, or always if requested */}
        {user.hasCompletedOnboarding && (
          <nav className="fixed bottom-4 left-4 right-4 sm:absolute sm:bottom-6 sm:left-4 sm:right-4 z-[150] bg-white border-4 border-black shadow-retro rounded-2xl px-2 py-2 flex items-center justify-around gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl font-display transition-all flex-1",
                  activeTab === tab.id 
                    ? "bg-brand-purple text-white" 
                    : "hover:bg-brand-purple/10 text-black"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            ))}
          </nav>
        )}
      </ErrorBoundary>
    </MobileShell>
  );
}
