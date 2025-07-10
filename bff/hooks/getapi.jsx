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
    const headerConfig = {"x-api-key": apiKeys, Authorization:'Bearer '+Cookies.get('auth_token')}


    const actionRequest = async ({ endPoint, params, hd }) => {
        setError(null);
        setData(null);
        setLoading(true);

        try {
            const response = await axios.get(endPoint, { params: params, headers: { ...headerConfig, ...hd } });
            const data = response.data;
            setData(data);
            setLoading(false);
            return data;
        } catch (err) {
            let errorMessage = err.response?.data.message || err.message;
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    return { data, loading, error, actionRequest, setError, setData, setLoading };
}
export default useGetApi;
