// assets
import { DashboardOutlined,DropboxOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  DropboxOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
   
  ]
};

export default dashboard;
