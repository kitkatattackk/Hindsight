/**
 * Service to handle Web Push Notifications and local reminders
 */

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  static async sendTestNotification() {
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Hindsight', {
        body: 'This is a test notification from Molly! 🌟',
        icon: 'https://picsum.photos/seed/molly/192/192',
        badge: 'https://picsum.photos/seed/molly/72/72',
        tag: 'test-notification'
      });
    }
  }

  /**
   * In a real app, this would send the subscription to a backend.
   * For this demo, we'll simulate the scheduling logic.
   */
  static async scheduleReminder(title: string, body: string, time: string) {
    console.log(`Scheduling reminder: "${title}" at ${time}`);
    // In a real PWA, you might use the Periodic Sync API or a backend cron job.
    // For now, we'll just log it.
  }
}
