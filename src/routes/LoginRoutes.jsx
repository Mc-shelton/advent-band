import { lazy } from 'react';

// project import
import Loadable from '@/components/Loadable';
import MainLayout from '../layout/MainLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('@/pages/authentication/Login')));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element:<AuthLogin/>
    }
  ]
};

export default LoginRoutes;
