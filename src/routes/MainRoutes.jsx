// project import
import Loadable from '@/components/Loadable';
import MainLayout from '../layout/MainLayout';

// Statically imported pages to support offline bundle
import DashboardPage from '../pages/dashboard';
import AuthPage from '../pages/authentication/auth';
import AuthLoginPage from '../pages/authentication/login';
import HymnsPage from '../pages/hymns';
import BiblePage from '../pages/bible';
import DiscoverPage from '../pages/discover';
import RemediesPage from '../pages/discover/remedies';
import CommunityPage from '../pages/community';
import EstatePage from '../pages/estate';
import PdfViewerPage from '../pages/viewers/pdfViewer';
import LessonBooksPage from '../pages/estate/lessons';
import UploaderPage from '../pages/loader';
import EpubReaderPage from '../pages/viewers/epubViewer';
import FolderBooksPage from '../pages/estate/egw';
import EgwViewerPage from '../pages/viewers/egwViewer';

const DashboardDefault = Loadable(DashboardPage);
const Auth = Loadable(AuthPage);
const AuthLogin = Loadable(AuthLoginPage);
const Hymns = Loadable(HymnsPage);
const Bible = Loadable(BiblePage);
const Discover = Loadable(DiscoverPage);
const Remedies = Loadable(RemediesPage);
const Community = Loadable(CommunityPage);
const Estate = Loadable(EstatePage);
const PdfViewer = Loadable(PdfViewerPage);
const LessonBooks = Loadable(LessonBooksPage);
const Uploader = Loadable(UploaderPage);
const EpubReader = Loadable(EpubReaderPage);
const FolderBooks = Loadable(FolderBooksPage);
const EgwViewer = Loadable(EgwViewerPage);

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
