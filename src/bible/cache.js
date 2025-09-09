import { idbGet, idbSet, idbHas } from '@/lib/idb';

const booksKey = (bibleId) => `bible::${bibleId}::books`;
const chaptersKey = (bibleId, bookId) => `bible::${bibleId}::book::${bookId}::chapters`;
const passageKey = (bibleId, passageId) => `bible::${bibleId}::passage::${passageId}`;
const readyKey = (bibleId) => `bible::${bibleId}::ready`;

// fetcher(path) should return { data: ... } like axios.get().data or similar
export async function getBooksCached(bibleId, fetcher) {
  const k = booksKey(bibleId);
  const cached = await idbGet(k);
  if (cached) return cached;
  const res = await fetcher(`bibles/${bibleId}/books`);
  const data = res?.data || res;
  await idbSet(k, data);
  return data;
}

export async function getChaptersCached(bibleId, bookId, fetcher) {
  const k = chaptersKey(bibleId, bookId);
  const cached = await idbGet(k);
  if (cached) return cached;
  const res = await fetcher(`bibles/${bibleId}/books/${bookId}/chapters`);
  const data = res?.data || res;
  await idbSet(k, data);
  return data;
}

export async function getPassageCached(bibleId, passageId, fetcher) {
  const k = passageKey(bibleId, passageId);
  const cached = await idbGet(k);
  if (cached) return cached;
  const res = await fetcher(`bibles/${bibleId}/passages/${passageId}`);
  const data = res?.data || res;
  await idbSet(k, data);
  return data;
}

export async function isBibleReady(bibleId) {
  return await idbHas(readyKey(bibleId));
}

// Pre-download all books, chapters and passages for a bible
// onProgress({ current, total, label }) is optional
export function createWarmupController() {
  let paused = false;
  let cancelled = false;
  let resumeResolver = null;
  return {
    pause() { paused = true; },
    resume() { paused = false; if (resumeResolver) { resumeResolver(); resumeResolver = null; } },
    cancel() { cancelled = true; },
    get paused() { return paused; },
    get cancelled() { return cancelled; },
    async waitIfPaused() {
      if (!paused) return;
      await new Promise((resolve) => { resumeResolver = resolve; });
    }
  };
}

export async function warmUpBible(bibleId, fetcher, onProgress, controller) {
  try {
    const books = await getBooksCached(bibleId, fetcher);
    let total = 0;
    const chaptersPerBook = {};
    for (const bk of books) {
      if (controller?.cancelled) return;
      const chs = await getChaptersCached(bibleId, bk.id, fetcher);
      chaptersPerBook[bk.id] = chs;
      total += (chs?.length || 0);
    }
    let current = 0;
    for (const bk of books) {
      const chs = chaptersPerBook[bk.id] || [];
      for (const ch of chs) {
        if (controller?.cancelled) return;
        if (controller?.paused) await controller.waitIfPaused();
        const pid = ch.id;
        await getPassageCached(bibleId, pid, fetcher);
        current++;
        if (onProgress) onProgress({ current, total, label: `Downloading ${bk.name} ${ch.number}` });
      }
    }
    await idbSet(readyKey(bibleId), true);
    if (onProgress) onProgress({ current: total, total, label: 'Complete' });
  } catch (e) {
    if (onProgress) onProgress({ current: 0, total: 0, label: 'Error downloading bible' });
  }
}
