import RepeatIcon from "@mui/icons-material/Repeat";
import testImage from "../../../assets/images/dailybread.jpeg";
import { useState } from "react";
import { useGiraf } from "../../../giraf";
const Events = () => {
  const { gHead, addGHead } = useGiraf();
  return (
    <div
      className="comm_events"
      onClick={() => {
        addGHead("comm_page", 'ev_page');
        let prev = gHead.comm_page_prev || [];
        addGHead("comm_page_prev", ["events"]);
        addGHead("prev_view_key", 'comm_page')
        addGHead("prev_view_value", 'ev_main')
      }}
    >
      <p className="comm_titles" style={
        {
          marginTop: "0px",
          paddingLeft: "5%",
        }
      }>Events</p>

      <div className="ce_card">
        <div
          className="ce_card_img"
          style={{
            backgroundImage: `url(${testImage})`,
          }}
        ></div>
        <p className="ce_p1">FOC, Nairobi</p>
        <p className="ce_p2">14th Fri, April 2025</p>
        <p className="ce_p3">
          <RepeatIcon
            style={{
              fontSize: "12px",
              marginRight: "5px",
            }}
          />{" "}
          Every 1st Fridady
        </p>
        <p className="ce_p4">Street Vesperse - Agha Khan Walk</p>
      </div>
      <div className="ce_card">
        <div
          className="ce_card_img"
          style={{
            backgroundImage: `url(${testImage})`,
          }}
        ></div>
        <p className="ce_p1">FOC, Nairobi</p>
        <p className="ce_p2">14th Fri, April 2025</p>
        <p className="ce_p3">
          <RepeatIcon
            style={{
              fontSize: "12px",
              marginRight: "5px",
            }}
          />{" "}
          Every 1st Fridady
        </p>
        <p className="ce_p4">Street Vesperse - Agha Khan Walk</p>
      </div>
      <div className="ce_card">
        <div
          className="ce_card_img"
          style={{
            backgroundImage: `url(${testImage})`,
          }}
        ></div>
        <p className="ce_p1">Nairobi</p>
        <p className="ce_p2">14th Fri, April 2025</p>
        <p className="ce_p3">
          <RepeatIcon
            style={{
              fontSize: "12px",
              marginRight: "5px",
            }}
          />{" "}
          Every 1st Fridady
        </p>
        <p className="ce_p4">Street Vesperse - Agha Khan Walk</p>
      </div>
    </div>
  );
};

export default Events;
