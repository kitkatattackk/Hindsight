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

import { LayoutDashboard, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { NotificationService } from './services/notificationService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<DayLog[]>(() => {
    const saved = localStorage.getItem('hindsight_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hindsight_user');
    const onboarded = localStorage.getItem('hindsight_onboarded') === '1';
    const defaults = {
      name: '',
      notificationTime: '21:00',
      categories: ['Work', 'Money', 'Relationships', 'Health', 'Impulse', 'Social'],
      hasCompletedOnboarding: onboarded,
      mollyExpression: 'neutral',
      mollyColor: '#FDEE88',
      notificationsEnabled: false,
      categoryReminders: []
    };
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    // onboarded flag wins — ensures reinstalls never re-show onboarding
    return { ...parsed, hasCompletedOnboarding: parsed.hasCompletedOnboarding || onboarded };
  });
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Insights', icon: LayoutDashboard },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  // Handle side effects like service worker registration
  useEffect(() => {
    if (user.notificationsEnabled) {
      NotificationService.registerServiceWorker();
    }
  }, [user.notificationsEnabled]);

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

  const handleDeleteLog = (logId: string) => {
    const updatedLogs = logs.filter(l => l.id !== logId);
    setLogs(updatedLogs);
    localStorage.setItem('hindsight_logs', JSON.stringify(updatedLogs));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('hindsight_user', JSON.stringify(updatedUser));
    if (updatedUser.hasCompletedOnboarding) {
      localStorage.setItem('hindsight_onboarded', '1');
    }
  };

  return (
    <MobileShell>
      <ErrorBoundary>
        {!user.hasCompletedOnboarding ? (
          <Onboarding key="onboarding-screen" onComplete={handleUpdateUser} />
        ) : (
          <>
            <Layout
              onCheckIn={() => setIsCheckInOpen(true)}
              user={user}
            >
              <ErrorBoundary>
                {activeTab === 'dashboard' && <Dashboard logs={logs} onCheckIn={() => setIsCheckInOpen(true)} />}
                {activeTab === 'journal' && <Journal logs={logs} onUpdateLog={handleUpdateLog} onDeleteLog={handleDeleteLog} />}
                {activeTab === 'settings' && <Settings user={user} onUpdateUser={handleUpdateUser} />}
              </ErrorBoundary>
            </Layout>

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
          </>
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
