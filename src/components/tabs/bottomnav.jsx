import { useState } from "react";
import "../../assets/styles/global.css";
import { HomeFilled } from "@ant-design/icons";
import menuItems from "./menuitems";
import { useGiraf } from "../../giraf";
import { useLocation, useNavigate } from "react-router-dom";
import { prefetchPath, prefetchCommon } from "@/routes/prefetch";
import { useEffect } from "react";
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
  const location = useLocation();

  // Derive selected tab from current route so highlight stays in sync
  useEffect(() => {
    const path = location.pathname;
    const idx = menuItems.findIndex(m => m.path === path);
    if (idx >= 0) setSelected(idx);
    // Auto toggle mini-tab for Bible/Hymns based on route
    if (idx === 1 || idx === 2) {
      addGHead('m_tab', true);
      if (idx === 2) addGHead('s_t', 'Hymns');
      if (idx === 1) addGHead('s_t', 'Bible');
    } else {
      addGHead('m_tab', false);
    }
  }, [location.pathname]);

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
      // only set default hymn if none chosen yet
      if (!gHead.s_n) addGHead("s_n", `001`)
    }
    if(index ==1){
      addGHead('s_t', "Bible")
      // set a readable default for the Bible mini tab
      if (!gHead.bible_ref) addGHead("bible_ref", `Mwanzo 1`)
        if (!gHead.bible_ref) addGHead("bsearch", true)
      if (!gHead.bible_ref) addGHead("showBooks", true)
    }
    const path = menuItems[index].path;
    // Ensure the chunk is requested, then navigate
    prefetchPath(path);
    navigate(path);
  };

  // Kick off common prefetch once after first paint
  useEffect(() => {
    if (typeof window !== 'undefined') prefetchCommon();
  }, []);

  return (
    <div className="bottom_nav" >
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
                <ChevronLeftOutlined onClick={(e)=>{
                  e.stopPropagation();
                  if (selected === 1){
                    addGHead('bible_nav','prev');
                  } else if (selected === 2){
                    addGHead('hymn_nav','prev');
                  }
                }}/>
                <p className="base_p">
                  {selected === 1
                    ? (gHead.bible_ref || 'Mwanzo 1')
                    : selected === 2
                      ? ('Hymn ' + (gHead.s_n?.padStart(3,'0') || '001'))
                      : ''}
                </p>
                <ChevronRightOutlinedIcon onClick={(e)=>{
                  e.stopPropagation();
                  if (selected === 1){
                    addGHead('bible_nav','next');
                  } else if (selected === 2){
                    addGHead('hymn_nav','next');
                  }
                }}/>
            </div>
        </div>}
        <div className="nav">
      {menuItems.map((nav, index) => {
        return (
          <div
            key={index}
            className="n_nav"
            onMouseEnter={() => prefetchPath(menuItems[index].path)}
            onTouchStart={() => prefetchPath(menuItems[index].path)}
            onClick={() => handleClick(index)}
          >
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
