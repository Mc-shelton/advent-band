import {
    SettingOutlined,
    LogoutOutlined,
    CheckSquareOutlined
} from '@ant-design/icons'
const sales = {
    id:'group-account',
    title:'Sales',
    type:'group',
    children:[
        {
            id:'checkout',
            title:'Checkout',
            type:'item',
            url:'/sales/checkout',
            icon: CheckSquareOutlined,
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

export default sales