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
import { DayLog, UserProfile } from './types';
import { mockLogs, mockUser } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<DayLog[]>(mockLogs);
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

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

  if (!user.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleUpdateUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onCheckIn={() => setIsCheckInOpen(true)}
        user={user}
      >
        {activeTab === 'dashboard' && <Dashboard logs={logs} onCheckIn={() => setIsCheckInOpen(true)} />}
        {activeTab === 'journal' && <Journal logs={logs} onUpdateLog={handleUpdateLog} />}
        {activeTab === 'settings' && <Settings user={user} onUpdateUser={handleUpdateUser} />}
      </Layout>

      <AnimatePresence>
        {isCheckInOpen && (
          <CheckInRitual 
            onClose={() => setIsCheckInOpen(false)} 
            onSave={handleSaveLog}
            onUpdateLog={handleUpdateLog}
            pastLogs={logs}
            categories={user.categories}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
