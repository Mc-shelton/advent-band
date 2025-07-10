import testImage from '../../../assets/images/dailybread.jpg'
import { useGiraf } from '../../../giraf'

const ShopLanding = ({items})=>{
    const {gHead, addGHead} = useGiraf()
    return(
        <div className="s_landing">
            {items.map(item=>{
                return(
                    <div className="shops_card" key={item.id} onClick={()=>{
                        addGHead("shop_view", "itemView")
                        let prev = gHead.comm_page_prev || [];
                        addGHead("comm_page_prev", [...prev,'shop_main'])
                        addGHead("prev_view_key", 'shop_view')
                        addGHead("prev_view_value", 'landing')
                        addGHead("focused_item", item)
                    }}>
                        <div className='sc_ava' style={{
                            backgroundImage:`url(${item.image_url})`
                        }}></div>
                        <p className='sc_p1'>{item.name}</p>
                        <p className='sc_p2'>Ksh {item.price}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ShopLanding