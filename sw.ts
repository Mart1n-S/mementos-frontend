const CACHE_NAME = `mementos-ressources-api-v${new Date().getTime()}`

const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.ts',
  '/src/assets/images/histoire.jpg',
  '/src/assets/images/programmation.jpg',
  '/src/assets/images/anglais.jpg',
  '/src/assets/images/pays.jpg',
  '/src/assets/images/art.jpg',
  '/src/assets/images/science.jpg',
  '/src/assets/images/autres.jpg',
  '/src/assets/images/cinema.jpg',
  '/src/assets/images/education.jpg',
  '/src/assets/images/finance.jpg',
  '/src/assets/images/gastronomie.jpg',
  '/src/assets/images/mathematiques.jpg',
  '/src/assets/images/mode.jpg',
  '/src/assets/images/musique.jpg',
  '/src/assets/images/nature.jpg',
  '/src/assets/images/sante.jpg',
  '/src/assets/images/politique.jpg',
  '/src/assets/images/sport.jpg',
  '/src/assets/images/technologie.jpg',
  '/src/assets/images/voyage.jpg'
]

// Installer le service worker et mettre en cache les ressources statiques
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activer le service worker et nettoyer le cache précédent si nécessaire
self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepter les requêtes réseau et servir les ressources depuis le cache avec fallback réseau
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.url.startsWith('http')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Mettre à jour le cache avec la nouvelle réponse
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            const headers = new Headers(clonedResponse.headers);
            headers.append('sw-cache-timestamp', Date.now().toString());
            const newResponse = new Response(clonedResponse.body, { headers });

            cache.put(event.request, newResponse);
          });
          return networkResponse;
        })
        .catch(() => {
          // Si la requête réseau échoue, retourner la réponse du cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            } else {
              // En cas de problème, retourner une réponse par défaut (ex: page d'erreur)
              return caches.match('/index.html') as Promise<Response>;
            }
          });
        })
    );
  }
});


// Gestion des notifications push
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notification';
  const options: NotificationOptions = {
    body: data.body || 'C\'est l\'heure de réviser votre Mementos!',
    icon: data.icon || 'logo.svg',
    badge: data.badge || 'blogo.svg',
    data: data.url || '/mon-mementos',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});

// Gestion des messages reçus du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});
