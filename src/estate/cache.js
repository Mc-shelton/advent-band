import { createWarmupController } from '@/bible/cache';

const PDF_CACHE = 'pdf-v1';

async function addToCache(url) {
  if (!url) return;
  try {
    const cache = await caches.open(PDF_CACHE);
    const req = new Request(url, { mode: 'cors' });
    const cached = await cache.match(req);
    if (cached) return; // already cached
    const resp = await fetch(req);
    if (resp && resp.ok) await cache.put(req, resp.clone());
  } catch (_) {}
}

function computeLessonPdfUrl(t) {
  // prefer provided src
  if (t?.src) return t.src;
  // fallback to absg pattern used in app (best-effort)
  try {
    const q = parseInt((t?.path || '').split('-')[1]?.split('/')[0] || '1', 10).toString();
    const year = (t?.end_date || '').split('/')?.[2] || '';
    const week = (t?.path || '').split('/')?.[4] || '';
    const weekPadded = String(week).padStart(2, '0');
    const year2 = String(year).slice(-2);
    return `https://www.adultbiblestudyguide.org/pdf.php?file=${year}:${q}Q:SE:PDFs:EAQ${q}${year2}_${weekPadded}.pdf`;
  } catch {
    return undefined;
  }
}

export async function warmUpEstateLessons(books = [], onProgress, controller) {
  const urls = [];
  for (const t of books) {
    if (controller?.cancelled) return;
    if (t?.cover) urls.push(t.cover);
    const pdf = computeLessonPdfUrl(t);
    if (pdf) urls.push(pdf);
  }
  const total = urls.length;
  let current = 0;
  for (const u of urls) {
    if (controller?.cancelled) return;
    if (controller?.paused) await controller.waitIfPaused();
    await addToCache(u);
    current++;
    onProgress && onProgress({ current, total, label: `Caching ${current}/${total}` });
  }
  onProgress && onProgress({ current: total, total, label: 'Complete' });
}

export { createWarmupController };

// Prefetch EGW folder books: covers + content HTML via backend
export async function warmUpEgwBooks(books = [], baseUrl, onProgress, controller){
  const urls = [];
  for (const t of books){
    if (t?.pubnr) urls.push(`https://media2.egwwritings.org/covers/${t.pubnr}_s.jpg`);
    if (t?.url && t?.maxpuborder){
      const u = new URL(`${baseUrl.replace(/\/$/,'')}/estate/egw/content`);
      u.searchParams.set('id_pub', t.url);
      u.searchParams.set('maxpuborder', t.maxpuborder);
      urls.push(u.toString());
    }
  }
  const total = urls.length; let current = 0;
  for (const u of urls){
    if (controller?.cancelled) return;
    if (controller?.paused) await controller.waitIfPaused();
    try { await fetch(u, { mode:'cors' }); } catch {}
    current++;
    onProgress && onProgress({ current, total, label: `Caching ${current}/${total}` });
  }
  onProgress && onProgress({ current: total, total, label: 'Complete' });
}

// Prefetch ABC Library PDFs (and covers when available)
export async function warmUpAbcLibrary(items = [], onProgress, controller){
  const urls = [];
  for (const t of items){
    if (t?.cover) urls.push(t.cover);
    if (t?.url) urls.push(t.url);
  }
  const total = urls.length; let current = 0;
  for (const u of urls){
    if (controller?.cancelled) return;
    if (controller?.paused) await controller.waitIfPaused();
    // Try to cache PDFs via Cache API, others via fetch warm-up
    try {
      if (String(u).toLowerCase().endsWith('.pdf')) {
        await addToCache(u);
      } else {
        await fetch(u, { mode:'cors' });
      }
    } catch {}
    current++;
    onProgress && onProgress({ current, total, label: `Caching ${current}/${total}` });
  }
  onProgress && onProgress({ current: total, total, label: 'Complete' });
}
