import { lazy } from 'react';

// project import
import Loadable from '@/components/Loadable';
import MainLayout from '../layout/MainLayout';

// Lazy loaded pages
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')));
const Auth = Loadable(lazy(() => import('../pages/authentication/auth')));
const AuthLogin = Loadable(lazy(() => import('../pages/authentication/login')));
const Hymns = Loadable(lazy(() => import('../pages/hymns')));
const Bible = Loadable(lazy(() => import('../pages/bible')));
const Discover = Loadable(lazy(() => import('../pages/discover')));
const Remedies = Loadable(lazy(() => import('../pages/discover/remedies')));
const Community = Loadable(lazy(() => import('../pages/community')));
const Estate = Loadable(lazy(() => import('../pages/estate')));
const PdfViewer = Loadable(lazy(() => import('../pages/viewers/pdfViewer')));
const LessonBooks = Loadable(lazy(() => import('../pages/estate/lessons')));
const Uploader = Loadable(lazy(() => import('../pages/loader')));
const EpubReader = Loadable(lazy(() => import('../pages/viewers/epubViewer')));
const FolderBooks = Loadable(lazy(() => import('../pages/estate/egw')));
const EgwViewer = Loadable(lazy(() => import('../pages/viewers/egwViewer')));
// render - dashboard
// const DashboardDefault = Loadable(lazy(() => import('@/pages/dashboard')));
// const LoginScreen = Loadable(lazy(() => import('@/pages/authentication/login/index.jsx')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element:<DashboardDefault/>
    },
    {
      path:'loader', 
      element:<Uploader/>
    },
    {
      path: '/hymns',
      element:<Hymns/>
    },
    {
      path: '/bible',
      element:<Bible/>
    },
    {
      path: '/discover',
      element:<Discover/>
    },
    {
      path: '/estate',
      // element:<Estate/>,
      children:[
        {
          path:'/estate',
          element:<Estate/>
        },
        {
          path: '/estate/egw',
          element:<FolderBooks/>
        },
        {
          path: '/estate/lessons',
          element:<LessonBooks/>
        }
      ]
    },
    {
      path:'/viewer',
      children:[
        {
          path:'/viewer/pdf',
          element:<PdfViewer/>
        },
        {
          path:'/viewer/egw',
          element:<EgwViewer/>
        }
      ]
    },
    {
      path:'pubViewer',
      element:<EpubReader/>
    },
    {
      path: '/remedies',
      element:<Remedies/>
    },
    {
      path: '/community',
      element:<Community/>
    }
  ]
};

export default MainRoutes;
