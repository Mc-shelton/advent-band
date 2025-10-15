// Prefetch helpers keep the same shape as before, but the build now ships
// every route eagerly so there is nothing additional to fetch.

const knownPaths = new Set([
  '/',
  '/community',
  '/hymns',
  '/bible',
  '/discover',
  '/estate',
  '/estate/egw',
  '/estate/lessons',
  '/viewer/pdf',
  '/viewer/egw',
  '/pubViewer'
]);

const prefetched = new Set();

export function prefetchPath(path) {
  if (!knownPaths.has(path) || prefetched.has(path)) return;
  prefetched.add(path);
}

export function prefetchCommon() {
  const list = ['/', '/community', '/hymns', '/bible'];
  const rif = (cb) => (window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 250));
  rif(() => list.forEach(prefetchPath));
}
