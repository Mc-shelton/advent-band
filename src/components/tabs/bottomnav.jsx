import { useState } from "react";
import "../../assets/styles/global.css";
import { HomeFilled } from "@ant-design/icons";
import menuItems from "./menuitems";
import { useGiraf } from "../../giraf";
import { useNavigate } from "react-router-dom";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
const BottomNav = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selected, setSelected] = useState(0);
  const { gHead,addGHead } = useGiraf();
  const navigate = useNavigate();

  const handleClick = (index) => {
    setActiveIndex(index);
    setSelected(index);
    addGHead("login", false);
    setTimeout(() => {
      setActiveIndex(null);
    }, 1500);
    if (index == 5) {
      addGHead("sidebar", true);
    } else {
      addGHead("sidebar", false);
    }
    if(index == 2 || index == 1){
        addGHead('m_tab', true)
    }else{
        addGHead('m_tab', false)

    }
    if(index == 2){
      addGHead('s_t', "Hymns")
      addGHead("s_n", `001`)

    }
    if(index ==1){

      addGHead('s_t', "Bible")
      addGHead("s_n", `Genesis 1`)
      addGHead("bsearch", true)
      addGHead("showBooks", true)

    }
    navigate(menuItems[index].path);
  };

  return (
    <div className="bottom_nav">
        {gHead.m_tab && <div className="m_tab">
            <div className="note"><MusicNoteOutlinedIcon/></div>
            <div className="base" onClick={()=>{
                if(selected==2){
                  addGHead('search', true)
                }else if(selected == 1){
                  addGHead("bsearch", true)
                  addGHead('blister', true)
                  addGHead("showBooks", true)
                }
            }}>
                <ChevronLeftOutlined/>
                <p className="base_p">{gHead.s_t =='Bible'? gHead.s_n :'Hymn '+ (gHead.s_n?.padStart(3,'0') || '001')}</p>
                <ChevronRightOutlinedIcon/>
            </div>
        </div>}
        <div className="nav">
      {menuItems.map((nav, index) => {
        return (
          <div key={index} className="n_nav" onClick={() => handleClick(index)}>
            <div className={`n_icon ${activeIndex === index ? "active" : ""}`}>
              {selected === index ? nav.icon : nav.icon_o}
            </div>
            <p className="n_p">{nav.title}</p>
          </div>
        );
      })}
      </div>
    </div>
  );
};
export default BottomNav;
