import { useRoutes } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import { useGiraf } from '@/giraf/index';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const {gHead,addGHead} = useGiraf()
  useEffect(()=>{
    // Prefer unified cookie name, but keep backward compatibility
    let auth = Cookies.get('auth_token') || Cookies.get('AuthToken')
    let cart = localStorage.getItem("cart")
    if(cart){
      addGHead('cart', JSON.parse(cart))
    }else{
      addGHead('cart',  [])
    }
    if(auth){
      addGHead('AuthToken',auth)
      let token = auth.includes('Bearer ')? auth.split("Bearer ")[1] : auth
      try{
        const user = jwtDecode(token || '')
        addGHead("AuthUser",user)
        addGHead('Authenticated',true)
      }catch(e){
        // ignore bad token
      }
    }
  },[])
  return useRoutes([MainRoutes]);
}
