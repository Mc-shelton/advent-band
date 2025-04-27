import { useState, useCallback } from 'react';
import axios from 'axios';


const useAxios = (baseURL = '', hd) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...hd
    },
  });

  const get = useCallback(
    async (url, config) => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get(url, config);
        return response.data;
      } catch (err) {
        const axiosError = err;
        setError(axiosError);
        console.error('GET error:', axiosError);
        new Error(err)
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
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
