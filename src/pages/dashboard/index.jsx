import CButton from "../../components/buttton";
import "../../assets/styles/global.css";
import "../../assets/styles/dashboard.css";
import { useRef, useState } from "react";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import AttractionsOutlinedIcon from "@mui/icons-material/AttractionsOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import data from "../../assets/db/n_eng_db.json";
import { useGiraf } from "../../giraf";
import dailyBreadImage from "../../assets/images/dailybread.jpeg";
import { CloseOutlined, ShareOutlined } from "@mui/icons-material";
import { getDate } from "../../../bff/utils";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PdfViewer from "../viewers/pdfViewer";
const DashboardDefault = () => {
  const [m, setM] = useState("T");
  const { addGHead } = useGiraf();
  const [showDivotionalButts, setShowDivotionalButts] = useState(false);
  const devotionalRef = useRef();
  const navigate = useNavigate()
  const handleMChange = (t) => {
    setM(t);
  };
  return (
    <div className="Home nav_page">
      <div className="p_header">
        <p
          className={`${m == "T" ? "focus" : ""}`}
          onClick={() => handleMChange("T")}
        >
          Today
        </p>
        <p
          className={`${m == "C" ? "focus" : ""}`}
          onClick={() => {
            handleMChange("C")
            navigate('/community')
          }}
        >
          Community
        </p>
        <div className="h_icons">
          <div className="h_ic">
            <BoltIcon className="h_ic_" />
            <p>2</p>
          </div>
          <div className="h_ic">
            <NotificationsNoneOutlinedIcon className="h_ic_" />
            <p>2</p>
          </div>
        </div>
        <div>
          <CButton
            text={"Sign In"}
            onClick={() => {
              addGHead("login", true);
            }}
            style={{
              marginLeft: "15%",
              fontSize: "12px",
              paddingLeft: "18px",
              paddingRight: "18px",
              textWrap: "nowrap",
              width: "100%",
            }}
          />
        </div>
      </div>
      <div className="dashboard_page">
        <div className="header">
          <div className="header_side">
            <div className="liner">
              <div
                className="l_c"
                style={{
                  marginTop: "100px",
                  backgroundColor: "rgb(105, 148, 181)",
                  border: `2px solid  rgb(105, 148, 181)`,
                }}
              ></div>
              <div
                className="l_h"
                style={{
                  height: "165px",
                }}
              ></div>
            </div>
            <div className="liner">
              <div className="l_c"></div>
              <div
                className="l_h"
                style={{
                  height: "100px",
                }}
              ></div>
            </div>
            <div className="liner">
              <div className="l_c"></div>
            </div>
          </div>

          <div className="header_main">
            <p className="m_header">Daily Refresh</p>
            <div
              className="hs_1"
              ref={devotionalRef}
              style={{
                backgroundImage: showDivotionalButts
                  ? ` linear-gradient(to top,rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 90%, transparent),url(${dailyBreadImage})`
                  : ` linear-gradient(to top,rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.5) 50%, transparent),url(${dailyBreadImage})`,
              }}
            >
              <div className="hs_container">
                <p className="hs_p1">Did You Know?</p>
                <p className="hs_p2">Prophecy Time</p>
                <p
                  className="hs_p3"
                  style={{
                    height: showDivotionalButts && "75%",
                    overflow: showDivotionalButts && "scroll",
                  }}
                  onClick={() => {
                    devotionalRef.current.style.position = "absolute";
                    devotionalRef.current.style.top = "0";
                    devotionalRef.current.style.left = "0";
                    devotionalRef.current.style.borderRadius = "0px";
                    devotionalRef.current.style.height = "100%";
                    devotionalRef.current.style.zIndex = "100005";
                    setShowDivotionalButts(true);
                  }}
                >
                  According to modern prophecy, sunday is the mark of the beast,
                  This we read from the book of Revelation 13, with a strong
                  concodance with the book of Leviticus
                  <br />
                  sunday is the mark of the beast, This we read from the book of
                  Revelation 13, with a strong concodance with the book of
                  Leviticus
                  <br />
                  sunday is the mark of the beast, This we read from the book of
                  Revelation 13, with a strong concodance with the book of
                  Leviticus
                </p>
                {!showDivotionalButts && (
                  <div className="hs_b_holder">
                    <ShareOutlined />
                  </div>
                )}
                {showDivotionalButts && (
                  <div className="hs_b_holder hs_full">
                    <CloseOutlined
                      onClick={() => {
                        devotionalRef.current.style.position = "relative";
                        devotionalRef.current.style.borderRadius = "15px";
                        devotionalRef.current.style.height = "250px";
                        devotionalRef.current.style.zIndex = "10";

                        setShowDivotionalButts(false);
                      }}
                    />
                    <ShareOutlined />
                  </div>
                )}
              </div>
            </div>
            <div className="hs_2">
              <div className="hs_2_left">
                <p className="hs_2_p1">Mission Devotional</p>
                <br />
                <p className="hs_2_p2">
                  {getDate(new Date())} : Testimonies of Kayole Mission
                </p>
                <p className="hs_2_p3">
                  <ClockCircleOutlined /> 20 min
                </p>
              </div>
              <div
                className="hs_2_right"
                style={{
                  backgroundImage: `url(${dailyBreadImage})`,
                }}
              ></div>
            </div>
            <div className="hs_2">
              <div className="hs_2_left">
                <p className="hs_2_p1">Voice Of Prophecy</p>
                <br />
                <p className="hs_2_p2">The Man Who Hanged On A Cross</p>
                <p className="hs_2_p3">
                  <ClockCircleOutlined /> 40 min
                </p>
              </div>
              <div
                className="hs_2_right"
                style={{
                  backgroundImage: `url(${dailyBreadImage})`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="d_content">
          <p className="dc_p1">Sermons</p>
          <div className="d_holder">
            <div
              className="d_av"
              style={{
                backgroundImage: `url(${dailyBreadImage})`,
              }}
            ></div>
            <div className="d_cont">
              <p className="hs_2_p1">C.D Brooks</p>
              <br />
              <p className="hs_2_p2">The Man Who Hanged On A Cross</p>
              <p className="hs_2_p3">
                <ClockCircleOutlined /> 40 min
              </p>
            </div>
          </div>
          <div className="d_holder">
            <div
              className="d_av"
              style={{
                backgroundImage: `url(${dailyBreadImage})`,
              }}
            ></div>
            <div className="d_cont">
              <p className="hs_2_p1">C.D Brooks</p>
              <br />
              <p className="hs_2_p2">The Man Who Hanged On A Cross</p>
              <p className="hs_2_p3">
                <ClockCircleOutlined /> 40 min
              </p>
            </div>
          </div>
          <div className="d_holder">
            <div
              className="d_av"
              style={{
                backgroundImage: `url(${dailyBreadImage})`,
              }}
            ></div>
            <div className="d_cont">
              <p className="hs_2_p1">C.D Brooks</p>
              <br />
              <p className="hs_2_p2">The Man Who Hanged On A Cross</p>
              <p className="hs_2_p3">
                <ClockCircleOutlined /> 40 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDefault;
