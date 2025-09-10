// Simple service worker for caching static assets and GET requests
const STATIC_CACHE = 'static-v3';
const API_CACHE = 'api-v3';
const PDF_CACHE = 'pdf-v1';
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
  // Backend API domain used by this app
  'https://backend.adventband.org:3122'
];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isWhitelistedApi = WHITELISTED_ORIGINS.includes(url.origin);
  const isPdf = url.pathname.endsWith('.pdf') || url.searchParams.get('pdfUrl');

  // Cache-first for PDFs (offline ready)
  if (isPdf) {
    event.respondWith(
      caches.open(PDF_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const resp = await fetch(request, { mode: request.mode, credentials: request.credentials });
          if (resp && resp.ok) cache.put(request, resp.clone());
          return resp;
        } catch (e) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

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
