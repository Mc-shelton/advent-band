// Simple service worker for caching static assets and GET requests
const STATIC_CACHE = 'static-v2';
const API_CACHE = 'api-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== API_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isSameOrigin(url) {
  try {
    const u = new URL(url);
    return u.origin === self.location.origin;
  } catch {
    return false;
  }
}

// Runtime caching: cache-first for static, stale-while-revalidate for API
const WHITELISTED_ORIGINS = [
  'https://api.scripture.api.bible',
  'https://web-pi-two-28.vercel.app',
];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isWhitelistedApi = WHITELISTED_ORIGINS.includes(url.origin);

  if (isSameOrigin(request.url)) {
    // Same-origin: prefer cache for static assets and documents
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkResp) => {
          const copy = networkResp.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return networkResp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  if (isWhitelistedApi) {
    // Stale-while-revalidate for Scripture API responses
    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request).then((resp) => {
            if (resp && resp.ok) cache.put(request, resp.clone());
            return resp;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
