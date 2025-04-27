import { SearchOutlined } from "@mui/icons-material";
import "../../assets/styles/discover.css";
import { useState } from "react";
import { useGiraf } from "../../giraf";
import testAvator from '../../assets/images/dailybread.jpeg'
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const Discover = () => {
  const [searchText, setSearchText] = useState();
  const { gHead, addGHead } = useGiraf();
  const navigate = useNavigate()
  return (
    <div className="discover nav_page">
      <p className="d_tt">Discover</p>
      <div className="d_search">
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
                backgroundColor:' rgb(244,244,244)'
            }}
          />
        </div>
      </div>
      <div className="slid_butts">
        <p>Remedies & Herbs</p>
        <p>Procedures</p>
        <p>Diseases & Mgt</p>
      </div>
      <div className="ds_container" onClick={()=>{
        navigate("/remedies")
      }}>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
        <div className="ds_box">
            <div className="ds_box_ava" style={{
                backgroundImage:`url(${testAvator})`
            }}></div>
            <p className="ds_box_t"><ClockCircleOutlined/> 40 Mins Read</p>
            <p className="ds_box_hd">
                Garlic Paultice And Arthritis
            </p>
        </div>
      </div>
    </div>
  );
};

export default Discover;
