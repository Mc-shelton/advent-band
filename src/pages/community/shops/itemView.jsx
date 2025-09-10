import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowLeftRounded,
  KeyboardArrowRightOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import testImage from "../../../assets/images/dailybread.jpg";
import { useEffect, useState } from "react";
import { useGiraf } from "../../../giraf";
import MessageBox from "../../../components/message";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
import LazyBg from "../../../components/LazyBg";
import Loading from "../../../components/loading";
const ItemView = () => {
  const { gHead, addGHead } = useGiraf();
  const [item, setItem] = useState(gHead.focused_item);
  const [startX, setStartX] = useState(null);
  const [testImages, setTestImages] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [quantity, setQueantity] = useState(1);
  const [loading, setLoading] = useState(true)

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const { actionRequest } = useGetApi();

  useEffect(() => {
    actionRequest({
      endPoint: `${baseUrl}/shops/items/thumb_nails`,
      params: { item_id: item?.id },
      cacheKey: `shop_item_thumbs_${item?.id || 'unknown'}`,
      strategy: 'cache-first',
      cacheTtlMs: 60 * 60 * 1000,
      onUpdate: (res) => {
        setTestImages(res.data || []);
        if (Array.isArray(res.data)) setImageIndex(parseInt(res.data.length / 2));
      }
    })
      .then((res) => {
        setTestImages((r) => res.data || []);
        if (Array.isArray(res.data)) setImageIndex(parseInt(res.data.length / 2));
      })
      .catch(() => {
        pushMessage("failed getting images", "error");
      })
      .finally(() => {
        setLoading(false)
      })
  }, []);

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

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;

    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleSlideRight();
      } else {
        handleSlideLeft();
      }
      setStartX(null); // reset to prevent multiple triggers
    }
  };
  const handleSlideRight = () => {
    if (imageIndex < testImages.length - 1) {
      setImageIndex((t) => {
        return t + 1;
      });
    } else {
      setImageIndex((t) => {
        return 0;
      });
    }
  };
  const handleSlideLeft = () => {
    if (imageIndex > 0) {
      setImageIndex((t) => {
        return t - 1;
      });
    } else {
      setImageIndex((t) => {
        return testImages.length - 1;
      });
    }
  };

  return (
    <div className="item_view">
      {loading && <Loading/>}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
      <div>
        <LazyBg
          className="item_view_image"
          src={testImages[imageIndex]?.url}
          placeholderColor="#f1f1f1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <KeyboardArrowLeftOutlined className="arr_navs" onClick={handleSlideLeft} />
          <KeyboardArrowRightOutlined className="arr_navs" onClick={handleSlideRight} />
        </LazyBg>
        <div className="slider_show">
          {testImages.map((l, x) => (
            <div key={x} style={{ backgroundColor: imageIndex == x && "rgb(218, 142, 0)" }} />
          ))}
        </div>
        <p className="item_tt">{item.name}</p>
        <p className="item_dt">Description</p>
        <p className="item_d">{item.description}</p>
        <br />
        <p className="item_dt">Mentions</p>
        <div className="item_mentions">
          <p>comming soon...</p>
        </div>
        <br />
        <br />
      </div>
      <aside className="item_sidebar">
        <div className="b_butts" style={{ gap: 8 }}>
          <p>Qnt :</p>
          <input
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQueantity(parseInt(e.target.value || '1', 10))}
            placeholder="1"
            style={{
              border: "1px solid gray",
              outline: "none",
              borderRadius: "5px",
              width: "46px",
              textAlign: "center",
            }}
          />
        </div>
        <div className="price">Ksh {item.price}</div>
        <div
          className="t_butt cta"
          onClick={() => {
            let ex = gHead.cart;
            let cItem = { ...item, quantity };
            if (ex.filter((l) => l.id == item.id).length < 1) ex.push(cItem);
            pushMessage("item added to cart", "success");
            localStorage.setItem("cart", JSON.stringify(ex));
            addGHead("is_added_to_cart", true);
          }}
        >
          Add to cart
        </div>
      </aside>
    </div>
  );
};

export default ItemView;
