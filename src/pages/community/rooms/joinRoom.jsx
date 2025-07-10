import { useState } from "react";
import { baseUrl, usePostApi } from "../../../../bff/hooks";
import { getDate } from "../../../../bff/lib/utils";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { useGiraf } from "../../../giraf";
import { join } from "lodash";

const JoinRoom = ({ room }) => {
  const { gHead, addGHead } = useGiraf();
  const { actionRequest } = usePostApi();
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

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
  const joinRoom = () => {
    if (!gHead.user || !gHead.user?.name)
      return pushMessage("sign in to access this resource", "error");
    setLoading(true)
    actionRequest({
      endPoint: `${baseUrl}rooms/join`,
      params: {
        room_id: room.id,
      },
    })
      .then((res) => {
        addGHead("refresh_rooms", true);
        addGHead("join_room_view", false);
      })
      .catch((err) => {
        console.log("error joining room :: ", err);
        pushMessage(err.message, "error");
      }).finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="cr_join_room">
      {loading && <Loading />}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
      <div className="cr_j_container">
        <h4 className="cr_cr_t">Join Room</h4>
        <p className="cr_cr_h">{room?.title}</p>
        <div className="cr_cr_hl">
          <p className="cr_cr_p">Created by : {room?.Owner.name}</p>
          <p className="cr_cr_p">
            Created at : {getDate(new Date(room.created_at))}
          </p>
        </div>
        <div className="cr_butts">
          <p onClick={()=>{
            joinRoom();
          }}>Join</p>
          <p
            onClick={() => {
              addGHead("join_room_view", false);
            }}
          >
            Close
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
