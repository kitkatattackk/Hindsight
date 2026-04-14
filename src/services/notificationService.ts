import { LocalNotifications } from '@capacitor/local-notifications';

const NIGHTLY_ID = 1;

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch {
      // Fallback for web
      if (!('Notification' in window)) return false;
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
  }

  static async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (e) {
        console.warn('SW registration failed', e);
      }
    }
  }

  /** Schedule (or reschedule) the nightly reminder at the given HH:MM time. */
  static async scheduleNightlyReminder(time: string): Promise<void> {
    try {
      // Cancel any existing nightly reminder first
      await LocalNotifications.cancel({ notifications: [{ id: NIGHTLY_ID }] });

      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const next = new Date();
      next.setHours(hours, minutes, 0, 0);
      // If that time has already passed today, schedule for tomorrow
      if (next <= now) next.setDate(next.getDate() + 1);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: NIGHTLY_ID,
            title: "Time for your Hindsight ritual 🌙",
            body: "Take 2 minutes to reflect on today with Molly.",
            schedule: { at: next, repeats: true, every: 'day' },
            smallIcon: 'ic_launcher',
            iconColor: '#4C22ED',
          },
        ],
      });
    } catch (e) {
      console.warn('Could not schedule notification', e);
    }
  }

  static async cancelNightlyReminder(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: NIGHTLY_ID }] });
    } catch (e) {
      console.warn('Could not cancel notification', e);
    }
  }

  static async sendTestNotification(): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 99,
            title: 'Hindsight 👋',
            body: "Molly says hi! Notifications are working.",
            schedule: { at: new Date(Date.now() + 1000) },
            smallIcon: 'ic_launcher',
            iconColor: '#4C22ED',
          },
        ],
      });
    } catch (e) {
      console.warn('Test notification failed', e);
    }
  }
}
