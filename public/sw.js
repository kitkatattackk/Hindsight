// Service Worker for Hindsight Notifications
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Hindsight Reminder';
  const options = {
    body: data.body || 'Time for your nightly ritual!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
