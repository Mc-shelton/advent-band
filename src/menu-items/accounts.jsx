import {
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons'
const accounts = {
    id:'group-account',
    title:'Account',
    type:'group',
    children:[
        {
            id:'settings',
            title:'Settings',
            type:'item',
            url:'/account/settings',
            icon: SettingOutlined,
        },
        {
            id:'logout',
            title:'LogOut',
            type:'item',
            url:'/account/logout',
            icon: LogoutOutlined
        }
    ]
}

export default accounts