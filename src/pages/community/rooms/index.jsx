import { AddBusinessOutlined } from "@mui/icons-material";
import "../../../assets/styles/rooms.css";
import ChatThread from "./thread";
import { useState } from "react";
import { useGiraf } from "../../../giraf";
import CreateRoomView from "./createView";
const Rooms = () => {
  const colors = [
    ["rgb(220, 220, 220)", "black"], // Light gray
    ["rgb(101, 114, 173)", "white"], // Blue-gray
    ["rgb(162, 101, 173)", "white"], // Purple
    ["rgb(101, 114, 173)", "white"], // Repeated blue-gray
    ["rgb(58, 90, 122)", "white"], // Deep slate blue
    ["rgb(240, 173, 78)", "black"], // Warm amber
    ["rgb(84, 153, 199)", "white"], // Sky blue
    ["rgb(255, 87, 87)", "white"], // Soft red
    ["rgb(38, 70, 83)", "white"], // Dark cyan slate
    ["rgb(253, 231, 76)", "black"], // Bright yellow
  ];
  const testCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [showFloatButton, setShowFoatButton] = useState(true);
  const { gHead, addGHead } = useGiraf();
  function getRandomColor(i) {
    const colorIndex = Math.floor(Math.random() * i);
    return colors[colorIndex];
  }
  return (
    <div className="comm_events rooms_page">
      {(!gHead.room_view || gHead.room_view == "room_main") && (
        <div
          className="cr_float_butt"
          onClick={() => {
            setShowFoatButton(false);
            addGHead("room_view", "room_create");
            addGHead("comm_page_prev", ["rooms"]);
            addGHead("prev_view_key", "room_view");
            addGHead("prev_view_value", "room_main");
          }}
        >
          <AddBusinessOutlined
            style={{
              fontSize: "20px",
            }}
          />
        </div>
      )}
      {(!gHead.room_view || gHead.room_view == "room_main") && (
        <p className="comm_titles">Study Rooms</p>
      )}
      {(!gHead.room_view || gHead.room_view == "room_main") && (
        <p
          style={{
            fontWeight: "300",
            margin: 0,
          }}
        >
          My Rooms
        </p>
      )}
      {(!gHead.room_view || gHead.room_view == "room_main") &&
        testCards.map((l, i) => {
          const [bgColor, textColor] = getRandomColor(colors.length);
          return (
            <div
              className="cr_card"
              onClick={() => {
                setShowFoatButton(false);
                addGHead("room_view", "room_chat");
                addGHead("comm_page_prev", ["rooms"]);
                addGHead("prev_view_key", "room_view");
                addGHead("prev_view_value", "room_main");
              }}
            >
              <div
                className="cr_avator"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                TM
              </div>
              <div className="cr_content">
                <p className="cr_title">Where do people go when they die?</p>
                <p className="cr_und">
                  {" "}
                  Thur 12, July 2025 | created by : somefancy Name
                </p>
              </div>
            </div>
          );
        })}
      {gHead.room_view == "room_chat" && <ChatThread />}
      {gHead.room_view == "room_create" && <CreateRoomView />}
    </div>
  );
};

export default Rooms;
