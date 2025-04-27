import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowLeftRounded,
  KeyboardArrowRightOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import testImage from "../../../assets/images/dailybread.jpeg";
import { useState } from "react";
const ItemView = () => {
  const [startX, setStartX] = useState(null);
  const testImages = [testImage, testImage, testImage, testImage, testImage]
  const [imageIndex, setImageIndex] = useState(parseInt(testImages.length/2))

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

    if(imageIndex < testImages.length-1){
        setImageIndex(t=>{
            return t+1
        })
    }else{
        setImageIndex(t=>{
            return 0
        })
    }
  };
  const handleSlideLeft = () => {
    if(imageIndex > 0){
        setImageIndex(t=>{
            return t-1
        })
    }else{
        setImageIndex(t=>{
            return testImages.length-1
        })
    }
  };

  return (
    <div className="item_view">
      <div
        className="item_view_image"
        style={{
          backgroundImage: `url(${testImage})`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <KeyboardArrowLeftOutlined className="arr_navs"   onClick={()=>{
            handleSlideLeft()
        }}/>
        <KeyboardArrowRightOutlined className="arr_navs" onClick={()=>{
            handleSlideRight()
        }} />
      </div>
      <div className="slider_show">
        {testImages.map((l,x)=>{
            return(
                <div key={x} style={{
                    backgroundColor: imageIndex == x &&  'rgb(218, 142, 0)'
                }}></div>
            )
        })}
      </div>
      <div className="b_butts">
        <p>Qnt :</p>
        <select>
            <option>0.1</option>
            <option>0.5</option>
            <option>0.7</option>
        </select>
        <p>Ksh 800</p>
        <div className="t_butt">Add to cart</div>
      </div>
      <p className="item_tt">Honey From Maasai Land</p>
      <p className="item_dt">Description</p>
      <p className="item_d">Just a lot of stuff concerning this item
      Just a lot of stuff concerning this item
      Just a lot of stuff concerning this item
      Just a lot of stuff concerning this item
      Just a lot of stuff concerning this item

      Just a lot of stuff concerning this itemJust a lot of stuff concerning this item
      Just a lot of stuff concerning this item
      </p>
      <br/>
      <p className="item_dt">Mentions</p>
      <div className="item_mentions">
        <p>1. Book | Title of some article</p>
        <p>2. Book | Title of some article</p>
        <p>3. Article | Title of some article</p>
        <p>4. Article | Title of some article</p>
      </div>
      <br/>
      <br/>

    </div>
  );
};

export default ItemView;
