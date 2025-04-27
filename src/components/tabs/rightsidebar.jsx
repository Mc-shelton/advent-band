import { HeartOutlined } from '@ant-design/icons'
import '../../assets/styles/sidebar.css'
import CommingSoon from '../comming'
const RightSideBar = ()=>{
    return(
        <div className='rightsidebar'>
            <div className='p_h'>
                <p className='h'>More</p>
                <p className='give'>
                    <HeartOutlined className='i'/>
                    <p>Mission Support</p>
                </p>
            </div>
            <div className='b'>
                <CommingSoon/>
            </div>
        </div>
    )
}

export default RightSideBar