import { lazy } from 'react';

// project import
import Loadable from '@/components/Loadable';
import DashboardDefault from '../pages/dashboard'
import Auth from '../pages/authentication/auth';
import AuthLogin from '../pages/authentication/login';
import MainLayout from '../layout/MainLayout';
import Hymns from '../pages/hymns';
import Bible from '../pages/bible';
import Discover from '../pages/discover';
import Remedies from '../pages/discover/remedies';
import Community from '../pages/community';
import Estate from '../pages/estate';
import PdfViewer from '../pages/viewers/pdfViewer';
import LessonBooks from '../pages/estate/lessons';
import Uploader from '../pages/loader';
import EpubReader from '../pages/viewers/epubViewer';
import FolderBooks from '../pages/estate/egw';
import EgwViewer from '../pages/viewers/egwViewer';
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
