// ============================================================
// Service Worker – Calisthenics Pro (Offline-Caching)
// Version: 1.0 | Strategie: Cache-First für lokale Dateien
// ============================================================

const CACHE_NAME = 'calisthenics-pro-v1';

// NUR lokale Dateien cachen – externe CDN-URLs NICHT hier
// eintragen (addAll() schlägt fehl, wenn ein einziger Request
// scheitert, z. B. wegen CORS oder Offline bei Erstinstall).
// Externe Ressourcen (Tailwind, FontAwesome, Google Fonts)
// werden automatisch beim ersten Laden dynamisch gecacht.
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// ----------------------------------------------------------
// INSTALL: Lokale Kern-Dateien vorladen
// ----------------------------------------------------------
self.addEventListener('install', (event) => {
  console.log('[SW] Install – caching core assets');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ----------------------------------------------------------
// ACTIVATE: Veraltete Caches löschen
// ----------------------------------------------------------
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate – cleaning old caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ----------------------------------------------------------
// FETCH: Cache-First – Netzwerk als Fallback
// ----------------------------------------------------------
self.addEventListener('fetch', (event) => {
  // Nur GET-Requests abfangen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Cache-Treffer
      }

      // Kein Treffer – aus Netzwerk laden und dynamisch cachen
      return fetch(event.request)
        .then((networkResponse) => {
          // Nur gültige same-origin oder basic Antworten cachen
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          // Response klonen (darf nur einmal gelesen werden)
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline-Fallback: bei Navigation immer index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          // Für andere Ressourcen: nichts zurückgeben
        });
    })
  );
});
