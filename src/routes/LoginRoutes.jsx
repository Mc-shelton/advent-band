import { lazy } from 'react';

// project import
import Loadable from '@/components/Loadable';
import MainLayout from '../layout/MainLayout';

// render - login
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element:<div>something</div>
    }
  ]
};

export default LoginRoutes;
