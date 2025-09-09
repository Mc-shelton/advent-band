import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useGiraf } from "../../src/giraf";
import { apiKeys } from ".";
import Cookies from 'js-cookie'

const API_KEY = import.meta.env.VITE_API_KEY
const API_URL_TABS = import.meta.env.VITE_API_URL_TABS
const API_URL_AUTH = import.meta.env.VITE_API_URL_AUTH

function usePostApi() {
    //   const { endPoint, params } = apiProps;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {gHead, addGHead} = useGiraf()
    const headerConfig = {"x-api-key": apiKeys, Authorization:'Bearer '+(Cookies.get('auth_token') || Cookies.get('AuthToken')?.replace('Bearer ','') )}
       
    const actionRequest = async ({
        endPoint,
        params,
        ctype,
        hd
    }) => {
        const configType = ctype || "AUTH";
        setError(null);
        setData(null);
        setLoading(true);
        
        try {
            const { data: res } = await axios.post(endPoint, params, { headers: { ...headerConfig, ...hd } })
            setData(res)
            setLoading(false)
            return res
        } catch (err) {
            let errorMessage = err.response?.data.message || err.message
            console.log(errorMessage)
            if(!errorMessage) errorMessage = err.message
            setError(errorMessage);
            setLoading(false)
            
            throw new Error(errorMessage)

        }

    };
    return { data, loading, error, actionRequest, setError, setData, setLoading };
}
export default usePostApi;
