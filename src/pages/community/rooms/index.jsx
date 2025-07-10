import { AddBusinessOutlined, RefreshOutlined } from "@mui/icons-material";
import "../../../assets/styles/rooms.css";
import ChatThread from "./thread";
import { useEffect, useState } from "react";
import { useGiraf } from "../../../giraf";
import CreateRoomView from "./createView";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { getDate } from "../../../../bff/lib/utils";
import JoinRoom from "./joinRoom";
import { add } from "lodash";

const Rooms = () => {
  const colors = [
    ["rgb(220, 220, 220)", "black"],
    ["rgb(101, 114, 173)", "white"],
    ["rgb(162, 101, 173)", "white"],
    ["rgb(58, 90, 122)", "white"],
    ["rgb(240, 173, 78)", "black"],
    ["rgb(84, 153, 199)", "white"],
    ["rgb(255, 87, 87)", "white"],
    ["rgb(38, 70, 83)", "white"],
    ["rgb(253, 231, 76)", "black"],
  ];

  const [showFloatButton, setShowFloatButton] = useState(true);
  const { gHead, addGHead } = useGiraf();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [rooms, setRooms] = useState(gHead.user_rooms || []);
  const [focusedRoom, setFocusedRoom] = useState(null);
  const { actionRequest } = useGetApi();

  const getRandomColor = (i) => {
    const colorIndex = Math.floor(Math.random() * i);
    return colors[colorIndex];
  };

  const pushMessage = (msg, type) => {
    setMessageType(type);
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    setRooms(gHead.user_rooms || []);
  }, [gHead.user_rooms]);

  const currentUserId = gHead.user?.id;
  const userRooms = rooms.filter((r) => r.user_id === currentUserId);
  const userRoomIds = new Set(userRooms.map((r) => r.Room.id));

  const otherRooms = rooms
    .filter((r) => r.user_id !== currentUserId && !userRoomIds.has(r.Room.id))
    .reduce((acc, curr) => {
      if (!acc.some((r) => r.Room.id === curr.Room.id)) acc.push(curr);
      return acc;
    }, [])
    .sort(
      (a, b) =>
        new Date(b.Room.created_at).getTime() -
        new Date(a.Room.created_at).getTime()
    );
  return (
    <div className="comm_events rooms_page">
      {loading && <Loading />}
      {message && <MessageBox txt={message} type={messageType} />}

      {(!gHead.room_view || gHead.room_view === "room_main") && (
        <div
          className="cr_float_butt"
          onClick={() => {
            setShowFloatButton(false);
            addGHead("room_view", "room_create");
            addGHead("comm_page_prev", ["rooms"]);
            addGHead("prev_view_key", "room_view");
            addGHead("prev_view_value", "room_main");
          }}
        >
          <AddBusinessOutlined style={{ fontSize: "20px" }} />
        </div>
      )}

      {gHead.user ? (
        <div className="rooms_holder">
          {(!gHead.room_view || gHead.room_view === "room_main") && (
            <>
              <p className="comm_titles" style={{ paddingLeft: 0, display: "flex", alignItems: "center" }}>
                <span style={{}}>Study Rooms</span>

                <RefreshOutlined
                  style={{
                    fontSize: "30px",
                    marginLeft: "10px",
                    height: "20px",
                  }}
                  onClick={() => {
                    addGHead("refresh_rooms", true);
                  }}
                />
              </p>

              <p style={{ fontWeight: "300", margin: 0, textAlign: "left" }}>
                My Rooms
              </p>

              {userRooms.length > 0 ? (
                userRooms
                  .sort(
                    (a, b) =>
                      new Date(b.Room.created_at).getTime() -
                      new Date(a.Room.created_at).getTime()
                  )
                  .map((r, i) => {
                    const [bgColor, textColor] = getRandomColor(colors.length);
                    const room = r.Room;
                    return (
                      <div
                        className="cr_card"
                        key={room.id}
                        onClick={() => {
                          setShowFloatButton(false);
                          setFocusedRoom(room);
                          const roomData =
                            JSON.parse(localStorage.getItem(room.id)) || [];
                          addGHead("focused_room", roomData);
                          addGHead("focused_room_id", room.id);
                          addGHead("room_view", "room_chat");
                          addGHead("comm_page_prev", ["rooms"]);
                          addGHead("comm_page", "rooms_main");
                          addGHead("prev_view_key", "room_view");
                          addGHead("prev_view_value", "room_main");
                        }}
                      >
                        <div
                          className="cr_avator"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        />
                        <div className="cr_content">
                          <p className="cr_title">{room.title}</p>
                          <p className="cr_und">
                            {getDate(new Date(room.created_at))} | created by:{" "}
                            {room.Owner.name}
                          </p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p
                            className="cr_join"
                            style={{
                              border: "1px solid rgb(46, 77, 117)",
                              float: "right",
                              height: "20px",
                              width: "40px",
                              borderRadius: "50px",
                              color: "rgb(46, 77, 117)",
                              fontWeight: "500",
                              lineHeight: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                            }}
                          >
                            {
                              (
                                JSON.parse(localStorage.getItem(room.id)) || []
                              ).filter((chat) => chat.status != "READ").length
                            }{" "}
                          </p>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="cr_no_rooms" style={{ fontWeight: "300" }}>
                  No Rooms Joined Yet
                </p>
              )}

              <p
                style={{
                  fontWeight: "300",
                  marginTop: "4%",
                  textAlign: "left",
                }}
              >
                Other Rooms
              </p>

              {otherRooms.length > 0 ? (
                otherRooms.map((r, i) => {
                  const room = r.Room;
                  const [bgColor, textColor] = getRandomColor(colors.length);

                  return (
                    <div
                      className="cr_card"
                      key={room.id}
                      onClick={() => {
                        addGHead("join_room_view", true);
                        setFocusedRoom(room);
                      }}
                    >
                      <div
                        className="cr_avator"
                        style={{
                          backgroundColor: bgColor,
                          color: textColor,
                        }}
                      />
                      <div className="cr_content">
                        <p className="cr_title">{room.title}</p>
                        <p className="cr_und">
                          {getDate(new Date(room.created_at))} | created by:{" "}
                          {room.Owner?.name}
                        </p>
                      </div>
                      <div
                        style={{
                          border: "1px solid rgb(46, 77, 117)",
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          borderRadius: "5px",
                          marginLeft: "15%",
                        }}
                      >
                        <p
                          className="cr_join"
                          style={{
                            color: "rgb(46, 77, 117)",
                            fontWeight: "500",
                            lineHeight: "0",
                          }}
                        >
                          Join
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="cr_no_rooms" style={{ fontWeight: "300" }}>
                  No More Rooms To Join
                </p>
              )}
            </>
          )}

          {gHead.room_view === "room_chat" && <ChatThread room={focusedRoom} />}
          {gHead.room_view === "room_create" && <CreateRoomView />}
          {gHead.join_room_view && <JoinRoom room={focusedRoom} />}
        </div>
      ) : (
        <p style={{ fontWeight: "300", marginTop: "40%" }}>
          Sign in to access this resource
        </p>
      )}
    </div>
  );
};

export default Rooms;
