import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  User, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Clock,
  Tag,
  Plus,
  X,
  Edit2,
  Check,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Category, CategoryReminder } from '../types';
import { NotificationService } from '../services/notificationService';

import MollyCharacter, { MollyExpression } from './MollyCharacter';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export default function Settings({ user, onUpdateUser }: SettingsProps) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isRequestingNotifications, setIsRequestingNotifications] = useState(false);

  const handleTogglePush = async () => {
    if (!user.notificationsEnabled) {
      setIsRequestingNotifications(true);
      const granted = await NotificationService.requestPermission();
      if (granted) {
        await NotificationService.registerServiceWorker();
        await NotificationService.scheduleNightlyReminder(user.notificationTime);
        onUpdateUser({ ...user, notificationsEnabled: true });
        await NotificationService.sendTestNotification();
      }
      setIsRequestingNotifications(false);
    } else {
      await NotificationService.cancelNightlyReminder();
      onUpdateUser({ ...user, notificationsEnabled: false });
    }
  };

  const handleAddCategoryReminder = (categoryId: string) => {
    const newReminder: CategoryReminder = {
      id: Math.random().toString(36).substr(2, 9),
      categoryId,
      time: '12:00',
      enabled: true
    };
    onUpdateUser({
      ...user,
      categoryReminders: [...(user.categoryReminders || []), newReminder]
    });
  };

  const handleUpdateReminder = (id: string, updates: Partial<CategoryReminder>) => {
    onUpdateUser({
      ...user,
      categoryReminders: user.categoryReminders.map(r => r.id === id ? { ...r, ...updates } : r)
    });
  };

  const handleRemoveReminder = (id: string) => {
    onUpdateUser({
      ...user,
      categoryReminders: user.categoryReminders.filter(r => r.id !== id)
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !user.categories.includes(newCategory.trim())) {
      onUpdateUser({
        ...user,
        categories: [...user.categories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    onUpdateUser({
      ...user,
      categories: user.categories.filter(c => c !== cat),
      categoryReminders: (user.categoryReminders || []).filter(r => r.categoryId !== cat)
    });
  };

  const handleStartEdit = (cat: string) => {
    setEditingCategory(cat);
    setEditValue(cat);
  };

  const handleSaveEdit = () => {
    if (editingCategory && editValue.trim() && !user.categories.includes(editValue.trim())) {
      onUpdateUser({
        ...user,
        categories: user.categories.map(c => c === editingCategory ? editValue.trim() : c),
        categoryReminders: (user.categoryReminders || []).map(r => 
          r.categoryId === editingCategory ? { ...r, categoryId: editValue.trim() } : r
        )
      });
      setEditingCategory(null);
    } else if (editingCategory === editValue.trim()) {
      setEditingCategory(null);
    }
  };

  const expressions: MollyExpression[] = ['neutral', 'happy', 'surprised', 'thinking', 'sleepy'];
  const colors = ['#FDEE88', '#F310F6', '#4C22ED', '#FF5733', '#00D1FF', '#7CFF01'];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-white border-4 border-black shadow-retro rounded-3xl flex items-center justify-center overflow-hidden shrink-0">
          <MollyCharacter size={80} expression={user.mollyExpression} color={user.mollyColor} />
        </div>
        <div className="space-y-3 flex-1">
          <h2 className="text-2xl sm:text-3xl font-display">{user.name}</h2>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Expression</p>
            <div className="flex flex-wrap gap-1.5">
              {expressions.map(exp => (
                <button 
                  key={exp}
                  onClick={() => onUpdateUser({ ...user, mollyExpression: exp })}
                  className={cn(
                    "px-2 py-0.5 rounded-lg border-2 border-black font-bold text-[10px] capitalize transition-all",
                    user.mollyExpression === exp ? "bg-brand-purple text-white shadow-retro-sm" : "bg-white hover:bg-gray-50"
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Color</p>
            <div className="flex gap-2">
              {colors.map(c => (
                <button 
                  key={c}
                  onClick={() => onUpdateUser({ ...user, mollyColor: c })}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 border-black transition-all",
                    user.mollyColor === c ? "scale-125 shadow-retro-sm" : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-display flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-purple" />
            Notifications
          </h3>
          
          <div className="space-y-3">
            <div className="retro-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-black/50" />
                <div>
                  <p className="font-bold">Push Notifications</p>
                  <p className="text-xs text-black/50">Enable for Android & iPhone (PWA).</p>
                </div>
              </div>
              <button 
                onClick={handleTogglePush}
                disabled={isRequestingNotifications}
                className={cn(
                  "w-12 h-6 rounded-full relative border-2 border-black transition-colors",
                  user.notificationsEnabled ? "bg-brand-purple" : "bg-gray-200"
                )}
              >
                <motion.div 
                  animate={{ x: user.notificationsEnabled ? 24 : 4 }}
                  className="absolute top-1 w-3 h-3 bg-white rounded-full border border-black" 
                />
              </button>
            </div>

            <div className="retro-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-black/50" />
                <div>
                  <p className="font-bold">Nightly Ritual Reminder</p>
                  <p className="text-xs text-black/50">We'll nudge you to reflect before bed.</p>
                </div>
              </div>
              <input 
                type="time" 
                className="retro-input py-1 px-2 text-sm"
                value={user.notificationTime}
                onChange={async (e) => {
                  const newTime = e.target.value;
                  onUpdateUser({ ...user, notificationTime: newTime });
                  if (user.notificationsEnabled) {
                    await NotificationService.scheduleNightlyReminder(newTime);
                  }
                }}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-pink" />
            Custom Reminders
          </h3>
          <div className="retro-card space-y-4">
            <p className="text-xs text-black/50">Set specific times to reflect on certain areas of your life.</p>
            
            <div className="space-y-3">
              {(user.categoryReminders || []).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border-2 border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-yellow p-2 rounded-lg border border-black/10">
                      <Tag className="w-4 h-4 text-black/60" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{reminder.categoryId}</p>
                      <p className="text-[10px] text-black/40">Custom nudge</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="time" 
                      className="retro-input py-1 px-2 text-xs"
                      value={reminder.time}
                      onChange={(e) => handleUpdateReminder(reminder.id, { time: e.target.value })}
                    />
                    <button 
                      onClick={() => handleRemoveReminder(reminder.id)}
                      className="text-black/20 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {user.categories.filter(c => !(user.categoryReminders || []).some(r => r.categoryId === c)).length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Add reminder for:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.categories
                      .filter(c => !(user.categoryReminders || []).some(r => r.categoryId === c))
                      .map(cat => (
                        <button 
                          key={cat}
                          onClick={() => handleAddCategoryReminder(cat)}
                          className="px-3 py-1 rounded-lg border border-black/10 text-xs font-medium hover:bg-brand-yellow transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> {cat}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-display flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-pink" />
            Categories
          </h3>
          <div className="retro-card space-y-4">
            <div className="flex flex-wrap gap-2">
              {user.categories.map((c) => (
                <div 
                  key={c}
                  className="flex items-center gap-1 bg-brand-yellow px-3 py-1.5 rounded-xl border-2 border-black font-bold text-sm shadow-retro-sm"
                >
                  {editingCategory === c ? (
                    <div className="flex items-center gap-1">
                      <input 
                        autoFocus
                        className="bg-transparent border-none outline-none w-20 font-bold"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      />
                      <button onClick={handleSaveEdit} className="hover:text-green-600">
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{c}</span>
                      <div className="flex items-center gap-1 ml-1 border-l border-black/20 pl-1">
                        <button onClick={() => handleStartEdit(c)} className="hover:text-brand-purple">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleRemoveCategory(c)} className="hover:text-red-600">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-black/5">
              <input 
                type="text" 
                placeholder="New category..."
                className="retro-input flex-1 py-2 px-3 text-sm"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button 
                onClick={handleAddCategory}
                className="retro-button py-2 px-4 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-display flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-purple" />
            Privacy Settings
          </h3>
          <div className="retro-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Private Profile</p>
                <p className="text-xs text-black/50">Keep your regrets for your eyes only.</p>
              </div>
              <div className="w-12 h-6 bg-brand-purple rounded-full relative border-2 border-black">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full border border-black" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <div>
                <p className="font-bold">Share Wisdom Anonymously</p>
                <p className="text-xs text-black/50">Allow Molly to share your lessons without your name.</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative border-2 border-black">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full border border-black" />
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={() => onUpdateUser({ ...user, hasCompletedOnboarding: false })}
          className="w-full py-2 text-brand-purple font-bold flex items-center justify-center gap-2 hover:bg-brand-purple/5 rounded-2xl transition-colors mt-4 border-2 border-dashed border-brand-purple/20"
        >
          Reset Onboarding (Test Only)
        </button>

        <button className="w-full py-4 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
