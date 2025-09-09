import { idbGet, idbSet } from '@/lib/idb';

const hymnsKey = (code) => `hymns::${code}`;

const loaders = {
  ADH: () => import('@/assets/db/n_eng_db.json'),
  NZK: () => import('@/assets/db/n_swa_db.json'),
  DHO: () => import('@/assets/db/n_luo_db.json'),
};

export async function getHymnBookCached(code) {
  const k = hymnsKey(code);
  const cached = await idbGet(k);
  if (cached) return cached;
  const loader = loaders[code];
  if (!loader) throw new Error('Unknown hymn code');
  const mod = await loader();
  const data = mod.default || [];
  await idbSet(k, data);
  return data;
}

