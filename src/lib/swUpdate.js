// Trigger a best-effort service-worker update when online.
export const maybeUpdateServiceWorker = async () => {
  if (typeof window === 'undefined') return;
  if (!navigator.onLine) return;
  if (!('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.update().catch(() => {})));
  } catch {
    // swallow errors; update is best-effort
  }
};
