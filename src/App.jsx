import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThemeCustomization from "./themes";
import ScrollTop from "./components/ScrollTop";
import Routes from "./routes";
import { useGiraf } from "./giraf";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { baseUrl, useGetApi, usePostApi } from "../bff/hooks";
import { safeRandomId } from "./lib/uuid";
import { useGroupSocket } from "../bff/hooks/socket";
import Cookies from "js-cookie";

function App() {
  const [count, setCount] = useState(0);
  const { gHead, addGHead } = useGiraf();
  const { actionRequest } = useGetApi();
  const { actionRequest: actionPostRequest } = usePostApi();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.info('[offline-debug] App mounted, starting boot sequence');
  }, []);
  useEffect(() => {
    const token = Cookie.get("auth_token");
    if (!token) return;
    try{
      const user = jwtDecode(token);
      addGHead("auth_token", "Bearer " + token);
      addGHead("user", user);
    }catch(e){
      // ignore invalid token
    }
    // connnect to socket
    actionRequest({
      endPoint: `${baseUrl}rooms`,
      cacheKey: 'rooms',
      strategy: 'cache-first',
      cacheTtlMs: 5 * 60 * 1000,
      onUpdate: (res) => {
        addGHead("user_rooms", res.data);
      }
    })
      .then((res) => {
        addGHead("user_rooms", res.data);

        res.data.forEach((room) => {
          let roomData = localStorage.getItem(room.id);
          if (!roomData) {
            localStorage.setItem(room.id, JSON.stringify([]));
          }
        });

        actionRequest({
          endPoint: `${baseUrl}rooms/chats`,
          params: {
            room_id: "room.id",
          },
        })
          .then((res) => {
            const rooms = res.data;
            let existingRooms = Object.keys(localStorage);
            let keyRooms = rooms.map((chat) => chat.room_id);
            let rest = keyRooms.filter(
              (roomId) => !existingRooms.includes(roomId)
            );
            existingRooms = [...existingRooms, ...rest];
            // console.log("existing rooms ::: ", existingRooms);
            existingRooms.forEach((roomId) => {
              let chats = rooms.filter((chat) => chat.room_id == roomId);
              if (chats.length == 0) return;

              let oldChats = localStorage.getItem(roomId);
              // get new chats that are in chats but not in oldChats
              oldChats = oldChats ? JSON.parse(oldChats) : [];

              let newChats = [];

              chats.forEach((chat) => {
                let ld = oldChats.map((ch) => ch.content);
                if (ld.includes(chat.message)) {
                  return;
                }
                newChats.push(chat);
              });
              chats = newChats;
              if (chats.length > 0) {
                chats = chats.map((chat) => {
                  chat.group = chat.room_id;
                  chat.origin = chat.sender_id;
                  chat.timestamp = chat.created_at;
                  chat.content = chat.message;
                  chat.code = "200";
                  return chat;
                });
                // console.log("new chast", chats)
                console.log("old chats ::: ", oldChats);
                chats = [...oldChats, ...chats];
                localStorage.setItem(roomId, JSON.stringify(chats));
                // addGHead(roomId, chats);
              }
            });
            console.log();
          })
          .catch((err) => {
            console.log("Failed to load room chats", "error", err);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log("roomsm errors ::: ", err);
      })
      .finally(() => {
        setLoading(false);
      });
    return addGHead("room_creation", false);
  }, [gHead.refresh_rooms]);

  useEffect(() => {
    let c = Cookies.get("auth_token");
    let user = {};
    try{
      user = c ? jwtDecode(c) : {};
    }catch(e){ user = {}; }
    if (!user.id)
      user.id = localStorage.getItem("temp_user_id") || safeRandomId();
    localStorage.setItem("temp_user_id", user.id);
    const userActivity = {
      user_id: user.id,
      activity: "app_opened - app",
      timestamp: new Date().toLocaleString("en-KE", {
        timeZone: "Africa/Nairobi",
      }),
    };
    actionPostRequest({
      endPoint: `${baseUrl}/accounts/user/activity`,
      params: userActivity,
    })
      .then((res) => {
        console.log("User activity logged successfully");
      })
      .catch((err) => {
        // throw vercel error
        if (err.response && err.response.status === 500) {
          console.error("Server error while logging user activity", err);
          throw new Error("Server error while logging user activity");
        }
      });
  }, []);

  const handleMessage = (data) => {
    console.log("socket message received ::: ", data);
  };
  const { sendMessage } = useGroupSocket({
    onMessage: handleMessage,
  });
  // addGHead("sendMessage", sendMessage);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate async startup tasks
    setTimeout(() => {
      setReady(true);
    }, 1500); // Simulate 1.5s loading
  }, []);

  if (!ready)
    return (
      <div
        className="splash"
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          color:'black',
          fontSize:'12px'
        }}
      >
        Loading App...
      </div>
    );

  return (
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  );
}

export default App;
