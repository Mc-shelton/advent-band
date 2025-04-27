import testImage from '../../../assets/images/dailybread.jpeg'
import { useGiraf } from '../../../giraf'

const ShopLanding = ()=>{
    const testArray = [1,2,3,4,5,5,6,7,8]
    const {gHead, addGHead} = useGiraf()
    return(
        <div className="s_landing">
            {testArray.map(l=>{
                return(
                    <div className="shops_card" onClick={()=>{
                        addGHead("shop_view", "itemView")
                        let prev = gHead.comm_page_prev || [];
                        addGHead("comm_page_prev", [...prev,'shop_main'])
                        addGHead("prev_view_key", 'shop_view')
                        addGHead("prev_view_value", 'landing')
                    }}>
                        <div className='sc_ava' style={{
                            backgroundImage:`url(${testImage})`
                        }}></div>
                        <p className='sc_p1'>Natural Honey From Kakamega</p>
                        <p className='sc_p2'>Ksh 800 - 3000</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ShopLanding