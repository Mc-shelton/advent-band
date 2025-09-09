import { useEffect, useRef, useState } from "react";
import { useGiraf } from "../../src/giraf";
import Cookies from "js-cookie";
import { add } from "lodash";
import { WS_URL } from "../../src/config";

var doneDeals = [];
export const useGroupSocket = ({ onMessage }) => {
  const userGroups = ["room1", "room2", "room3"];
  const socketRef = useRef(null);
  const { gHead, addGHead } = useGiraf();

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;
    socket.onopen = () => {
      console.log("WebSocket connected");
      // Join all user groups
      // gHead.user_rooms.forEach((r) => {
      //   socket.send(JSON.stringify({ type: "join", group: r.Room.id }));
      // });
    };
    socket.onclose = () => {
      console.log("WebSocket closed", gHead.auth_token);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addGHead("notifications", (gHead.notifications || 0) + 1);
      if (
        doneDeals.filter((d) => d.group == data.group && d.content == data.content)
          .length > 0
      ) {
        console.log("message already sent, skipping", doneDeals);
        return;
      }
        console.log("####### message already sent, skipping", doneDeals);

      console.log("WebSocket message received:", data);
      // update both context and localstorage
      let room = localStorage.getItem(data.group);
      room = room ? JSON.parse(room) : [];
      room = [...room, data];
      localStorage.setItem(data.group, JSON.stringify(room));
      console.log("ghead", gHead.focused_room);
      let focusedRoom = gHead.focused_room ? gHead.focused_room : [];
      console.log(focusedRoom, "focused room");
      focusedRoom.push(data);
      addGHead("focused_room", room);
      doneDeals.push({ group: data.group, content: data.content });
      setTimeout(() => {
        doneDeals = []
      }, 10000);
    };

    return () => {
      socket.close();
    };
  }, [gHead.auth_token]);

  const sendMessage = (group, content, token) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      let auth = Cookies.get("auth_token");
      let user = gHead.user;
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          group,
          origin: user.id,
          content,
          "x-auth-key": auth,
        })
      );
    }
  };

  // addGHead("sendMessage", sendMessage);
  return { sendMessage };
};
