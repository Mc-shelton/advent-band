import {
  CardTravelOutlined,
  FilterListOutlined,
  FlareSharp,
  SearchOutlined,
} from "@mui/icons-material";
import "../../../assets/styles/shops.css";
import { useEffect, useState } from "react";
import { useGiraf } from "../../../giraf";
import ShopLanding from "./landing";
import {
  CloseOutlined,
  MenuOutlined,
  OrderedListOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ItemView from "./itemView";
import CartView from "./cartView";
import OrderView from "./orderView";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
const Shops = () => {
  const [searchText, setSearchText] = useState();
  const { gHead, addGHead } = useGiraf();
  const [showMenu, setShowMenu] = useState(false);

  const {actionRequest} = useGetApi()
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const [items, setItems] = useState([])



  const pushMessage = (m, t) => {
    setMessageType(t);
    setMessage((k) => {
      let i = m;
      setTimeout(() => {
        setMessage((p) => null);
      }, 3000);
      return i;
    });
  };


  useEffect(()=>{
    setLoading(true)
    actionRequest({endPoint:`${baseUrl}shops/items`}).then((res)=>{
      setItems(res.data)
    }).catch((err)=>{
      pushMessage(err.message, 'error')
    }).finally(()=>{
      setLoading(false)
    })
  },[])
  useEffect(() => {
    if (!gHead.shop_view) {
      addGHead("shop_view", "landing");
    }
  }, []);
  const floatNavigate = (t) => {
    addGHead("shop_view", t);
    let prev = gHead.comm_page_prev || [];
    addGHead("comm_page_prev", [t]);
    addGHead("prev_view_key", "shop_view");
    addGHead("prev_view_value", "landing");
    setShowMenu((t) => {
      return false;
    });
  };
  return (
    <div className="comm_events shops_page">
      {loading && <Loading />}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
      {!gHead.shop_view || gHead.shop_view == 'landing' && <p
        className="comm_titles"
        style={{
          marginTop: "-5px",
          marginBottom: "10px",
        }}
      >
        Shops
      </p>}

      <div
        className="floating_menu"
        style={{
          width: showMenu ? "120px" : "fit-content",
          backgroundColor: showMenu ? "white" : "transparent",
        }}
      >
        <div
          className="flm_butts"
          onClick={() => {
            setShowMenu((t) => {
              if (t) return false;
              return true;
            });
          }}
        >
          {!showMenu ? <MenuOutlined /> : <CloseOutlined />}
        </div>
        {showMenu && (
          <div className="flm_items">
            <div
              className="flm_item_l"
              onClick={() => {
                floatNavigate("landing");
                addGHead("comm_page_prev", []);
              }}
            >
              <FilterListOutlined className="flm_icons" />
              <p>Listing</p>
            </div>
            <div
              className="flm_item_l"
              onClick={() => {
                floatNavigate("cartView");
              }}
            >
              <ShoppingCartOutlined className="flm_icons" />
              <p>Cart</p>
            </div>
            <div
              className="flm_item_l"
              style={{
                marginBottom: "25px",
              }}
              onClick={() => {
                floatNavigate("orderView");
              }}
            >
              <OrderedListOutlined className="flm_icons" />
              <p>Orders</p>
            </div>
          </div>
        )}

        
      </div>

      {gHead.shop_view == "landing" && (
        <div className="search">
          <SearchOutlined />
          <input
            className="s_i"
            placeholder="search text..."
            value={searchText}
            onChange={(t) => {
              setSearchText(t.target.value);
            }}
            onFocus={() => {
              addGHead("keyboard", true);
              console.log("onfocus");
            }}
            onBlur={() => {
              setTimeout(() => {
                addGHead("keyboard", undefined);
              }, 100);
              console.log("onblure");
            }}
          />
        </div>
      )}

      {gHead.shop_view == "landing" && <ShopLanding  items={items}/>}
      {gHead.shop_view == "itemView" && <ItemView />}
      {gHead.shop_view == "cartView" && <CartView />}
      {gHead.shop_view == "orderView" && <OrderView />}
    </div>
  );
};

export default Shops;
