import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import { useGiraf } from '@/giraf/index';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const {gHead,addGHead} = useGiraf()
  useEffect(()=>{
    let auth = Cookies.get('AuthToken')
    let cart = localStorage.getItem("cart")
    if(cart){
      addGHead('cart', JSON.parse(cart))
    }else{
      addGHead('cart',  [])
    }
    if(auth){
      addGHead('AuthToken',auth)
      let token = auth.split("Bearer ")[1]
      const user = jwtDecode(token)
      addGHead("AuthUser",user)
      addGHead('Authenticated',true)

    }
  },[])
  return useRoutes([MainRoutes]);
}
