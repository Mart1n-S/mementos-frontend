const CACHE_NAME = `mementos-ressources-api-v${new Date().getTime()}`
const CACHE_EXPIRATION = 1 * 60 * 1000 // 1 hour in milliseconds
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
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
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

// Intercepter les requêtes réseau et servir les ressources depuis le cache
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.url.startsWith('http')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        const fetchRequest = fetch(event.request).then(networkResponse => {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            const headers = new Headers(clonedResponse.headers);
            headers.append('sw-cache-timestamp', Date.now().toString());
            cache.put(event.request, new Response(clonedResponse.body, { headers }));
          });
          return networkResponse;
        });

        if (response) {
          const responseTimestamp = response.headers.get('sw-cache-timestamp');
          if (responseTimestamp && Date.now() - parseInt(responseTimestamp) < CACHE_EXPIRATION) {
            return response;
          }
        }

        return fetchRequest;
      })
    );
  }
});