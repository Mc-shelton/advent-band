import axios from "axios";
import { useState } from "react";
import { useGiraf } from "../../src/giraf";
import { apiKeys } from ".";
import Cookies from 'js-cookie'

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL_TABS = import.meta.env.VITE_API_URL_TABS;
const API_URL_AUTH = import.meta.env.VITE_API_URL_AUTH;

function useGetApi() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { gHead, addGHead } = useGiraf();
    const headerConfig = {"x-api-key": apiKeys, Authorization:'Bearer '+(Cookies.get('auth_token') || Cookies.get('AuthToken')?.replace('Bearer ','') )}


    const actionRequest = async ({ endPoint, params, hd, cacheKey, strategy = 'network-first', cacheTtlMs = 5 * 60 * 1000, onUpdate }) => {
        setError(null);

        const storageKey = cacheKey ? `api_cache:${cacheKey}` : null;
        const now = Date.now();
        let cachedEntry = null;
        if (storageKey) {
            try {
                cachedEntry = JSON.parse(localStorage.getItem(storageKey));
            } catch (_) { cachedEntry = null; }
        }

        const hasFreshCache = !!(cachedEntry && (now - (cachedEntry.ts || 0) < cacheTtlMs));

        // cache-first path: return cached immediately, refresh in background
        if (storageKey && strategy === 'cache-first' && cachedEntry) {
            setData(cachedEntry.data);
            setLoading(false);
            // Background refresh (no throw)
            (async () => {
                try {
                    const response = await axios.get(endPoint, { params: params, headers: { ...headerConfig, ...hd } });
                    const fresh = response.data;
                    const changed = JSON.stringify(fresh) !== JSON.stringify(cachedEntry.data);
                    if (changed || !hasFreshCache) {
                        try { localStorage.setItem(storageKey, JSON.stringify({ ts: Date.now(), data: fresh })); } catch (_) {}
                        setData(fresh);
                        onUpdate && onUpdate(fresh);
                    }
                } catch (_) { /* ignore background errors */ }
            })();
            return cachedEntry.data;
        }

        // network-first path
        setData(null);
        setLoading(true);
        try {
            const response = await axios.get(endPoint, { params: params, headers: { ...headerConfig, ...hd } });
            const data = response.data;
            if (storageKey) {
                try { localStorage.setItem(storageKey, JSON.stringify({ ts: Date.now(), data })); } catch (_) {}
            }
            setData(data);
            setLoading(false);
            return data;
        } catch (err) {
            // If network fails but we have cache, surface cache
            if (storageKey && cachedEntry) {
                setData(cachedEntry.data);
                setLoading(false);
                return cachedEntry.data;
            }
            let errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    return { data, loading, error, actionRequest, setError, setData, setLoading };
}
export default useGetApi;
