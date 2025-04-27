// assets
import Icon, { LoginOutlined,SnippetsOutlined, ProfileOutlined, ShopOutlined,AppstoreAddOutlined, DropboxOutlined } from '@ant-design/icons';
import SvgIcon from '@mui/material/SvgIcon';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  ShopOutlined,
  DropboxOutlined,
  SnippetsOutlined,
  AppstoreAddOutlined
};
// 
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'group-catalog',
  title: 'Catalog',
  type: 'group',
  children: [
    {
      id: 'services',
      title: 'Services',
      type: 'item',
      url: '/services/my-services',
      icon: icons.AppstoreAddOutlined,
      breadcrumbs: false
    },
    {
      id: 'create-service',           
      title: 'Create Service',
      type: 'item',
      url: '/services/create',
      icon: icons.AppstoreAddOutlined,
      breadcrumbs: false
    },
    {
      id: 'orders',
      title: 'Orders',
      type: 'item',
      url: '/orders',
      icon: icons.SnippetsOutlined,
    },
    {
      id: 'restaurant',
      title: 'Restaurants',
      type: 'item',
      url: '/restaurant',
      icon: icons.ShopOutlined,    },
  ]
};

export default pages;
