import {Close} from '../assets/icons'
import '../assets/styles/global.css'
const CloseButton = ({onClick})=>{
    return(
        <div className='c-x'>
            <Close style={{
                height:'25px'
            }}
            onClick={()=>{
                onClick()
            }}
            />
        </div>
    )
}

export default CloseButton