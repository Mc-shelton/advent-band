import { SearchOutlined } from "@mui/icons-material";
import "../../assets/styles/estate.css";
import { useGiraf } from "../../giraf";
import { useState } from "react";
import testImage from "../../assets/images/dailybread.jpeg";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
const Estate = () => {
  const { gHead, addGHead } = useGiraf();
  const [searchText, setSearchText] = useState();
  const testList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [focused, setFocused] = useState();
  const [switchMenus, setSwitchmenus] = useState(false);
  return (
    <div className="nav_page estate">
      <p className="d_tt">ABC Estate</p>
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
          style={{
            backgroundColor: " rgb(244,244,244)",
          }}
        />
      </div>
      <div
        className="est_container"
        style={{
          overflow: focused && "hidden",
        }}
      >
        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "egw" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">EGW Estate</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "egw";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "egw" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">EGW Estate</p>
          </div>
        )}
        <div
          className={`${
            !focused || focused == "egw"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "egw"
              ? 
              
              {
                display: "flex",
                height: "93%",
                flexWrap: "wrap",
                maxWidth: "100%",
                justifyContent: "space-around",
                alignItems: "flex-start",
                overflow: "scroll",
                flexDirection: "row",
              }
              : 
              focused ? {
                display:'none'
              }:
              {
                display: "flex",
                //   border:'1px solid red',
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
                overflow: "scroll",
                flexDirection: "row",
              }
          }
        >
          {testList.map((item, index) => {
            return (
              <div className="est_side_lister_item focused" key={index}>
                <div
                  className="est_side_lister_item_img"
                  style={{
                    backgroundImage: `url(${testImage})`,
                  }}
                ></div>
                <div className="est_side_lister_item_text">
                  <p className="est_side_lister_item_text_hd">EGW Estate</p>
                  <p className="est_side_lister_item_text_sub">
                    Lorem ipsum dolor sit amet,
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ######################### */}

        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "pioneer" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">Pioneer Estate</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "pioneer";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "pioneer" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">Pioneer Estate</p>
          </div>
        )}
        <div
          className={`${
            !focused && focused != "pioneer"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "pioneer"
              ? 
              
              {
                // border:'1px solid blue',
                display: "flex",
                height: "93%",
                flexWrap: "wrap",
                maxWidth: "100%",
                justifyContent: "space-around",
                alignItems: "flex-start",
                overflow: "scroll",
                flexDirection: "row",
              }
              : 
              focused ? {
                display:'none'
              }:
              {
                display: "flex",
                //   border:'1px solid red',
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
                overflow: "scroll",
                flexDirection: "row",
              }
          }
        >
          {testList.map((item, index) => {
            return (
              <div className="est_side_lister_item focused" key={index}>
                <div
                  className="est_side_lister_item_img"
                  style={{
                    backgroundImage: `url(${testImage})`,
                  }}
                ></div>
                <div className="est_side_lister_item_text">
                  <p className="est_side_lister_item_text_hd">Pioneers Estate</p>
                  <p className="est_side_lister_item_text_sub">
                    Lorem ipsum dolor sit amet,
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ######################### */}
        
        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "abc" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">ABC Library</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "abc";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "abc" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">ABC Library</p>
          </div>
        )}
        <div
          className={`${
            !focused || focused == "abc"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "abc"
              ? 

              {
                display: "flex",
                height: "93%",
                flexWrap: "wrap",
                maxWidth: "100%",
                justifyContent: "space-around",
                alignItems: "flex-start",
                overflow: "scroll",
                flexDirection: "row",
              }
              : 
              focused ? {
                display:'none'
              }:

              {
                display: "flex",
                //   border:'1px solid red',
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
                overflow: "scroll",
                flexDirection: "row",
              }
          }
        >
          {testList.map((item, index) => {
            return (
              <div className="est_side_lister_item focused" key={index}>
                <div
                  className="est_side_lister_item_img"
                  style={{
                    backgroundImage: `url(${testImage})`,
                  }}
                ></div>
                <div className="est_side_lister_item_text">
                  <p className="est_side_lister_item_text_hd">ABC Library</p>
                  <p className="est_side_lister_item_text_sub">
                    Lorem ipsum dolor sit amet,
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ######################### */}
        
        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "local" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">Lesson Quarterly</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "local";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "local" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">lesson Quarterly</p>
          </div>
        )}
        <div
          className={`${
            !focused || focused == "local"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "local"
              ? 

              {
                display: "flex",
                height: "93%",
                flexWrap: "wrap",
                maxWidth: "100%",
                justifyContent: "space-around",
                alignItems: "flex-start",
                overflow: "scroll",
                flexDirection: "row",
              }
              : 
              focused ? {
                display:'none'
              }:

              {
                display: "flex",
                //   border:'1px solid red',
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "nowrap",
                overflow: "scroll",
                flexDirection: "row",
              }
          }
        >
          {testList.map((item, index) => {
            return (
              <div className="est_side_lister_item focused" key={index}>
                <div
                  className="est_side_lister_item_img"
                  style={{
                    backgroundImage: `url(${testImage})`,
                  }}
                ></div>
                <div className="est_side_lister_item_text">
                  <p className="est_side_lister_item_text_hd">Local Listing</p>
                  <p className="est_side_lister_item_text_sub">
                    Lorem ipsum dolor sit amet,
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ######################### */}
        
      </div>
    </div>
  );
};

export default Estate;
