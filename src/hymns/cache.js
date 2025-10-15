import { idbGet, idbSet } from '@/lib/idb';
import hymnsEng from '@/assets/db/n_eng_db.json';
import hymnsSwa from '@/assets/db/n_swa_db.json';
import hymnsLuo from '@/assets/db/n_luo_db.json';

const hymnsKey = (code) => `hymns::${code}`;

const hymnsData = {
  ADH: hymnsEng,
  NZK: hymnsSwa,
  DHO: hymnsLuo,
};

export async function getHymnBookCached(code) {
  const k = hymnsKey(code);
  const cached = await idbGet(k);
  if (cached) return cached;
  const data = hymnsData[code] ? hymnsData[code].default || hymnsData[code] : null;
  if (!data) throw new Error('Unknown hymn code');
  await idbSet(k, data);
  return data;
}
