import { useState, useCallback, useRef } from 'react';
import axios from 'axios';


// Simple cached GET helper with ETag + TTL and in-flight de-duplication
const inFlight = new Map();

const now = () => Date.now();
const storage = typeof window !== 'undefined' ? window.localStorage : null;

function cacheKey(baseURL, url) {
  return `ax-cache::${baseURL || ''}::${url}`;
}

function readCache(key) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function writeCache(key, value) {
  if (!storage) return;
  try { storage.setItem(key, JSON.stringify(value)); } catch (_) {}
}

const useAxios = (baseURL = '', hd) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const defaultTtlRef = useRef(15 * 60 * 1000); // 15 minutes

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...hd
    },
  });

  const get = useCallback(
    async (url, config = {}) => {
      const { ttl, swr, force } = (config || {});
      const key = cacheKey(baseURL, url);
      const cached = readCache(key);
      const maxAge = typeof ttl === 'number' ? ttl : defaultTtlRef.current;

      // Serve fresh cache immediately unless force=true
      if (!force && cached && cached.ts && (now() - cached.ts) < maxAge && cached.data !== undefined) {
        // Optionally background revalidate
        if (swr) {
          const inflightKey = key;
          if (!inFlight.has(inflightKey)) {
            const req = (async () => {
              try {
                const headers = { ...(config.headers || {}) };
                if (cached.etag) headers['If-None-Match'] = cached.etag;
                const res = await instance.get(url, { ...config, headers });
                const etag = res.headers?.etag || res.headers?.ETag;
                writeCache(key, { ts: now(), data: res.data, etag });
              } catch (_) { /* ignore */ }
              inFlight.delete(inflightKey);
            })();
            inFlight.set(inflightKey, req);
          }
        }
        return cached.data;
      }

      // Coalesce concurrent identical requests
      const inflightKey = key;
      if (inFlight.has(inflightKey)) {
        setLoading(true);
        setError(null);
        try {
          await inFlight.get(inflightKey);
          const fresh = readCache(key);
          return fresh?.data ?? null;
        } finally {
          setLoading(false);
        }
      }

      setLoading(true);
      setError(null);
      try {
        const headers = { ...(config.headers || {}) };
        if (cached?.etag) headers['If-None-Match'] = cached.etag;
        const req = instance.get(url, { ...config, headers });
        inFlight.set(inflightKey, req);
        const response = await req;
        const etag = response.headers?.etag || response.headers?.ETag;
        writeCache(key, { ts: now(), data: response.data, etag });
        return response.data;
      } catch (err) {
        // If 304 Not Modified, serve cached
        if (axios.isAxiosError(err) && err.response && err.response.status === 304 && cached?.data !== undefined) {
          writeCache(key, { ...cached, ts: now() });
          return cached.data;
        }
        const axiosError = err;
        setError(axiosError);
        console.error('GET error:', axiosError);
        return cached?.data ?? null;
      } finally {
        inFlight.delete(inflightKey);
        setLoading(false);
      }
    },
    [baseURL]
  );

  const post = useCallback(
    async (url, data, config) => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.post(url, data, config);
        return response.data;
      } catch (err) {
        const axiosError = err;
        setError(axiosError);
        console.error('POST error:', axiosError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    get,
    post,
    loading,
    error,
  };
};

export default useAxios;
