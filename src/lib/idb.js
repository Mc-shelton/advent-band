// Minimal IndexedDB key-value helper
const DB_NAME = 'ab_cache_db';
const STORE = 'kv';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const getReq = store.get(key);
    getReq.onsuccess = () => resolve(getReq.result ? getReq.result.value : undefined);
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function idbSet(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const putReq = store.put({ key, value, ts: Date.now() });
    putReq.onsuccess = () => resolve(true);
    putReq.onerror = () => reject(putReq.error);
  });
}

export async function idbHas(key) {
  const v = await idbGet(key);
  return v !== undefined;
}

