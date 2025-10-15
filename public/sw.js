// Simple service worker for caching static assets and GET requests
const STATIC_CACHE = 'static-v5';
const API_CACHE = 'api-v3';
const PDF_CACHE = 'pdf-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './sw.js',
  './manifest.json',
  './.vite/manifest.json',
];
const KNOWN_CACHES = new Set([STATIC_CACHE, API_CACHE, PDF_CACHE]);
const MANIFEST_CANDIDATES = ['./.vite/manifest.json', './manifest.json'];
const CORE_ROUTES = [
  '/',
  '/hymns',
  '/bible',
  '/discover',
  '/community',
];

async function precacheBuildAssets(cache) {
  try {
    let manifest;
    for (const candidate of MANIFEST_CANDIDATES) {
      const manifestUrl = normalizeToSameOrigin(candidate);
      if (!manifestUrl) {
        continue;
      }
      try {
        const response = await fetch(new Request(manifestUrl, { cache: 'no-store' }));
        if (response && response.ok) {
          manifest = await response.json();
          if (manifest && typeof manifest === 'object') {
            break;
          }
        }
      } catch {
        // try next candidate
      }
    }

    if (!manifest || typeof manifest !== 'object') {
      return;
    }

    const visited = new Set();
    const queue = Array.from(Object.keys(manifest || {}));
    const assetPaths = new Set();

    while (queue.length) {
      const key = queue.pop();
      if (!key || visited.has(key)) {
        continue;
      }
      visited.add(key);

      const entry = manifest[key];
      if (!entry || typeof entry !== 'object') {
        continue;
      }

      const { file, css, assets, imports, dynamicImports } = entry;
      if (file) assetPaths.add(file);
      if (Array.isArray(css)) css.forEach((p) => assetPaths.add(p));
      if (Array.isArray(assets)) assets.forEach((p) => assetPaths.add(p));

      const forwards = []
        .concat(Array.isArray(imports) ? imports : [])
        .concat(Array.isArray(dynamicImports) ? dynamicImports : []);
      for (const nextKey of forwards) {
        if (nextKey && !visited.has(nextKey)) {
          queue.push(nextKey);
        }
      }
    }

    const targets = [];
    for (const rawPath of assetPaths) {
      const candidate = rawPath.startsWith('/') ? rawPath : `./${rawPath}`;
      const normalized = normalizeToSameOrigin(candidate);
      if (normalized) {
        targets.push(normalized);
      }
    }

    await Promise.all(
      targets.map(async (url) => {
        try {
          await cache.add(new Request(url, { cache: 'reload' }));
        } catch {
          // Ignore individual asset failures to keep install resilient.
        }
      })
    );
  } catch {
    // Ignore manifest failures; runtime caching will still work.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      for (const asset of STATIC_ASSETS) {
        const normalized = normalizeToSameOrigin(asset);
        if (!normalized) {
          continue;
        }
        try {
          await cache.add(new Request(normalized, { cache: 'reload' }));
        } catch {
          // best effort for core shell assets
        }
      }
      await precacheBuildAssets(cache);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !KNOWN_CACHES.has(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
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

function normalizeToSameOrigin(url) {
  try {
    const base = (self.registration && self.registration.scope) || self.location.href;
    const normalized = new URL(url, base);
    if (normalized.origin !== self.location.origin) {
      return null;
    }
    return normalized.toString();
  } catch {
    return null;
  }
}

async function notifyClient(message, source) {
  if (source && typeof source.postMessage === 'function') {
    try {
      source.postMessage(message);
      return;
    } catch {
      // fall through to broadcast
    }
  }

  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of clients) {
    try {
      client.postMessage(message);
    } catch {
      // ignore failed notifications
    }
  }
}

self.addEventListener('message', (event) => {
  const data = event?.data;
  if (!data || typeof data !== 'object') {
    return;
  }

  if (data.type === 'prime-caches') {
    const assetList = Array.isArray(data.urls) ? data.urls : [];
    const routeList = Array.isArray(data.routes) && data.routes.length ? data.routes : CORE_ROUTES;
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open(STATIC_CACHE);
          const targets = new Set();
          for (const entry of [...assetList, ...routeList]) {
            const normalized = normalizeToSameOrigin(entry);
            if (normalized) {
              targets.add(normalized);
            }
          }
          const total = targets.size;
          let completed = 0;
          if (!total) {
            await notifyClient({ type: 'prime-caches-complete' }, event.source);
            return;
          }

          const reportProgress = async (url) => {
            if (!total) {
              return;
            }
            await notifyClient({ type: 'prime-caches-progress', total, completed, url }, event.source);
          };

          await reportProgress(null);

          const fetches = [...targets].map(async (absoluteUrl) => {
            const request = new Request(absoluteUrl, {
              credentials: 'include',
              cache: 'reload',
            });
            try {
              const response = await fetch(request);
              if (response && response.ok) {
                await cache.put(request, response.clone());
                completed += 1;
                await reportProgress(absoluteUrl);
              }
            } catch {
              // Ignore individual fetch failures to allow best-effort caching.
            }
          });
          await Promise.all(fetches);
          await reportProgress(null);
          await notifyClient({ type: 'prime-caches-complete' }, event.source);
        } catch (error) {
          await notifyClient(
            { type: 'prime-caches-error', message: error?.message || 'Unable to prime caches.' },
            event.source
          );
        }
      })()
    );
  }
});

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
  const isNavigate = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');

  // Navigation fallback: serve cached shell when offline
  if (isNavigate && isSameOrigin(request.url)) {
    const shellUrl = normalizeToSameOrigin('./index.html') || normalizeToSameOrigin('/index.html') || '/index.html';
    event.respondWith((async () => {
      const cachedShell = shellUrl ? await caches.match(shellUrl) : null;
      if (cachedShell) {
        return cachedShell;
      }
      try {
        return await fetch(request);
      } catch {
        if (shellUrl) {
          const fallback = await caches.match(shellUrl);
          if (fallback) {
            return fallback;
          }
        }
        return Response.error();
      }
    })());
    return;
  }

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
