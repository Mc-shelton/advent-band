import { useState } from "react";
import { baseUrl, usePostApi } from "../../../../bff/hooks";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { useGiraf } from "../../../giraf";

const CreateRoomView = () => {
  const { gHead, addGHead } = useGiraf();
  const { actionRequest } = usePostApi();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [messageType, setMessageType] = useState("");

  const createRoom = () => {
    if (!title || !description)
      return pushMessage("you must provide all fields", "warn");
    if (!gHead.user || !gHead.user?.name)
      return pushMessage(
        "please update your user details to access this resource"
      );
    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}rooms`,
      params: {
        title,
        ab_title: title,
        description,
      },
    })
      .then((res) => {
        addGHead("refresh_rooms", true);
        addGHead("room_view", "room_main");
        addGHead("comm_page_prev", []);
        addGHead("room_creation", true);
      })
      .catch((err) => {
        console.log("error creating room :: ", err);
        pushMessage(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pushMessage = (m, t) => {
    setMessageType(t);
    setMessage((k) => {
      let i = m;
      setTimeout(() => {
        setMessage((p) => null);
      }, 3000);
      return i;
    });
  };

  return (
    <div className="cr_create_room">
      {loading && <Loading />}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}

      <p className="cr_hd">Create Room</p>
      <p className="cr_title">Room Title (Summery of the question).</p>
      <input
        className="cr_input"
        type="text"
        placeholder="What is the sanctuary?"
        onFocus={() => {
          addGHead("keyboard", true);
          console.log("onfocus");
        }}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          setTimeout(() => {
            addGHead("keyboard", undefined);
          }, 100);
          console.log("onblure");
        }}
      ></input>
      <p className="cr_title">
        Room Description (Full statement of the question).
      </p>
      <textarea
        className="cr_textarea"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="full question goes here"
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
        rows={7}
      ></textarea>
      <div
        className="cr_room_butt"
        onClick={() => {
          createRoom();
        }}
      >
        Create Room
      </div>
      <p
        style={{
          fontSize: "10px",
          color: "#888",
          textAlign: "center",
        }}
      >
        We are planning to bring in annonymous rooms for sensitive topics like
        mential health and addictions. please click{" "}
        <a
          href="https://forms.gle/hjRiEPrpLeghpjhp7"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontStyle: "italic" }}
        >
          here
        </a>{" "}
        to drop in your suggestions.
      </p>
    </div>
  );
};
export default CreateRoomView;
