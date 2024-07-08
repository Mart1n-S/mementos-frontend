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
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting())
  )
})

// Activer le service worker et nettoyer le cache précédent si nécessaire
self.addEventListener('activate', function (event) {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            if (cacheWhitelist.indexOf(key) === -1) {
              return caches.delete(key)
            }
          })
        )
      })
      .then(() => self.clients.claim()) // Prend le contrôle de toutes les pages sans rechargement
  )
})

// Intercepter les requêtes réseau et servir les ressources depuis le cache
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return
  }

  if (event.request.url.startsWith('http')) {
    if (event.request.url.includes('/categories')) {
      event.respondWith(
        caches.match(event.request).then(function (response) {
          if (response) {
            fetch(event.request).then(function (networkResponse) {
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, networkResponse.clone())
              })
            })
            return response
          } else {
            return fetch(event.request).then(function (networkResponse) {
              let responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, responseClone)
              })
              return networkResponse
            })
          }
        })
      )
    } else {
      event.respondWith(
        caches.match(event.request).then(function (response) {
          return (
            response ||
            fetch(event.request).then(function (networkResponse) {
              let responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, responseClone)
              })
              return networkResponse
            })
          )
        })
      )
    }
  }
})
