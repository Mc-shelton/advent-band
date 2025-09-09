// Prefetch route chunks to avoid jank on navigation
// Uses the same dynamic imports as the lazy routes so Vite can fetch chunks early.

const routes = {
  '/': () => import('../pages/dashboard'),
  '/community': () => import('../pages/community'),
  '/hymns': () => import('../pages/hymns'),
  '/bible': () => import('../pages/bible'),
  '/discover': () => import('../pages/discover'),
  '/estate': () => import('../pages/estate'),
  '/estate/egw': () => import('../pages/estate/egw'),
  '/estate/lessons': () => import('../pages/estate/lessons'),
  '/viewer/pdf': () => import('../pages/viewers/pdfViewer'),
  '/viewer/egw': () => import('../pages/viewers/egwViewer'),
  '/pubViewer': () => import('../pages/viewers/epubViewer')
};

const prefetched = new Set();

export function prefetchPath(path) {
  const loader = routes[path];
  if (!loader || prefetched.has(path)) return;
  try {
    loader(); // trigger fetch; don't await
    prefetched.add(path);
  } catch (_) {}
}

export function prefetchCommon() {
  const list = ['/', '/community', '/hymns', '/bible'];
  const rif = (cb) => (window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 250));
  rif(() => list.forEach(prefetchPath));
}

