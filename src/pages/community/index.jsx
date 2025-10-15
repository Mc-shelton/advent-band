import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BoltIcon from "@mui/icons-material/Bolt";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CButton from "../../components/buttton";
import { useGiraf } from "../../giraf";
import "../../assets/styles/community.css";
import Events from "./events";
import {
  ArrowBackOutlined,
  BathtubOutlined,
  LocalFireDepartment,
  LocalFireDepartmentOutlined,
  MedicalInformationOutlined,
  StorefrontOutlined,
} from "@mui/icons-material";
import EventPage from "./events/page";
import Shops from "./shops";
import Rooms from "./rooms";

const Community = () => {
  const [m, setM] = useState("C");
  const navigate = useNavigate();
  const { gHead, addGHead } = useGiraf();
  const handleMChange = (t) => {
    setM(t);
  };
  return (
    <div className="nav_page">
      <div className="p_header">
        <p
          className={`${m == "T" ? "focus" : ""}`}
          onClick={() => {
            handleMChange("T");
            navigate("/");
          }}
        >
          Today
        </p>
        <p
          className={`${m == "C" ? "focus" : ""}`}
          onClick={() => {
            handleMChange("C");
            navigate("/community");
          }}
        >
          Community
        </p>
        <div className="h_icons">
          <div className="h_ic">
            <BoltIcon className="h_ic_" />
            {/* <p>2</p> */}
          </div>
          <div className="h_ic">
            <NotificationsNoneOutlinedIcon className="h_ic_" />
            {gHead.notifications > 0 && <p>
              {/* {(() => {
                let keys = Object.keys(localStorage);
                let unreadMessages = keys.map((k) => {
                  console.log(k);
                  let v = localStorage.getItem(k);
                  try{
                  v = v ? JSON.parse(v) : [];
                  }catch(e){
                    v = [];
                  }
                  if (v[0]?.group) {
                    let unread = v.filter((i) => i.status != "read" && i.user_id == gHead?.user?.id).length;
                    return unread;
                  } else {
                    return 0;
                  }
                });
                // find total of unread messages
                return unreadMessages.reduce((a, b) => a + b, 0);
              })()} */}
              {gHead.notifications || 0}
            </p>}
          </div>
        </div>
        <div style={{
          // border:'2px solid red',
          marginRight:'10px'
        }}>
          <CButton
            text={
              gHead.user
                ? gHead.user.name
                  ? gHead.user.name[0]
                  : gHead.user.email[0]
                : "Sign In" 
            }
            onClick={() => {
              addGHead("login", true);
            }}
            style={{
              marginLeft: "15%",
              fontWeight: gHead.user ? "700" : "400",
              fontSize: "12px",
              paddingLeft: "18px",
              paddingRight: "18px",
              textWrap: "nowrap",
              width: "100%",
            }}
          />
        </div>
      </div>
      <div className="dashboard_page comm_main">
        {gHead.comm_page && gHead.comm_page_prev?.length > 0 ? (
          <div className="comm_nav">
            <p
              onClick={() => {
                // Restore previous view and shrink the back-stack
                try{
                  const prevStack = Array.isArray(gHead.comm_page_prev) ? [...gHead.comm_page_prev] : [];
                  if (gHead.prev_view_key) {
                    addGHead(gHead.prev_view_key, gHead.prev_view_value);
                  }
                  // Remove the last entry so the top menu can reappear when stack is empty
                  if (prevStack.length > 0) prevStack.pop();
                  addGHead('comm_page_prev', prevStack);
                  // Optionally clear the prev_view refs when stack empties
                  if (prevStack.length === 0) {
                    addGHead('prev_view_key', undefined);
                    addGHead('prev_view_value', undefined);
                  }
                }catch(e){/* noop */}
              }}
              style={{
                display: "flex",
              }}
            >
              <ArrowBackOutlined
                style={{
                  margin: "0",
                  padding: "0",
                  fontSize: "23px",
                }}
              />
            </p>
          </div>
        ) : (
          <div className="comm_nav">
            <p
              onClick={() => {
                addGHead("comm_page", "rooms_main");
              }}
              style={{
                backgroundColor:
                  !gHead.comm_page || gHead.comm_page == "rooms_main"
                    ? "rgb(193, 193, 193)"
                    : "",
              }}
            >
              <BathtubOutlined className="cp_icon" />
              {/* Rooms */}
            </p>
            <p
              onClick={() => {
                addGHead("comm_page", "ev_main");
              }}
              style={{
                backgroundColor:
                  gHead.comm_page == "ev_main" ? "rgb(193, 193, 193)" : "",
              }}
            >
              <LocalFireDepartmentOutlined className="cp_icon" />
              {/* Events */}
            </p>
            <p
              onClick={() => {
                addGHead("comm_page", "shop_main");
              }}
              style={{
                backgroundColor:
                  gHead.comm_page == "shop_main" ? "rgb(193, 193, 193)" : "",
              }}
            >
              <StorefrontOutlined className="cp_icon" />
              {/* Shops */}
            </p>
            <p
              onClick={() => {
                addGHead("comm_page", "service_main");
              }}
              style={{
                backgroundColor:
                  gHead.comm_page == "service_main" ? "rgb(193, 193, 193)" : "",
              }}
            >
              <MedicalInformationOutlined className="cp_icon" />
              {/* Services */}
            </p>
          </div>
          //   <div className="comm_nav">
          //   <p onClick={()=>{
          //     addGHead("comm_page", "rooms_main");
          //   }}

          //   style={{
          //     backgroundColor: (!gHead.comm_page ||  gHead.comm_page == 'rooms_main') ? 'rgb(193, 193, 193)' : '',
          //   }}
          //   >
          //     Rooms
          //   </p>
          //    <p onClick={()=>{
          //     addGHead("comm_page", "ev_main");
          //   }}
          //   style={{
          //     backgroundColor: gHead.comm_page == 'ev_main' ? 'rgb(193, 193, 193)' : '',
          //   }}>
          //     Events
          //   </p>
          //   <p onClick={()=>{
          //     addGHead("comm_page", "shop_main");
          //   }}
          //   style={{
          //     backgroundColor: gHead.comm_page == 'shop_main' ? 'rgb(193, 193, 193)' : '',
          //   }}>
          //     Shops
          //   </p>
          //   <p onClick={()=>{
          //     addGHead("comm_page", "service_main");
          //   }}
          //   style={{
          //     backgroundColor: gHead.comm_page == 'service_main' ? 'rgb(193, 193, 193)' : '',
          //   }}>
          //     Services
          //   </p>
          // </div>
        )}
        {gHead.comm_page == "ev_main" && <Events />}
        {gHead.comm_page == "ev_page" && <EventPage />}
        {gHead.comm_page == "shop_main" && <Shops />}
        {(gHead.comm_page == "rooms_main" || !gHead.comm_page) && <Rooms />}
      </div>
    </div>
  );
};

export default Community;
