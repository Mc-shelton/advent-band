import { useEffect, useRef, useState } from "react";
import { MicOutlined } from "@mui/icons-material";
import { CheckOutlined, CloseOutlined, DownCircleOutlined, DownOutlined, PaperClipOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { useGiraf } from "../../../giraf";
import { getDate } from "../../../../bff/lib/utils";
import { useGroupSocket } from "../../../../bff/hooks/socket";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { add, set } from "lodash";

function ChatThread({room}) {
  const { gHead, addGHead } = useGiraf();
  const [messages, setMessages] = useState(gHead[room.id] || []);

  const [newMessage, setNewMessage] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  useEffect(()=>{
    
  },[])
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

  useEffect(() => {
      let messages = localStorage.getItem(room?.id)
      messages = messages ? JSON.parse(messages) : []
      // ## make every chats status to READ
      messages = messages.map((chat) => {
        if (chat.status !== "READ") {
          chat.status = "READ";
        }
        return chat;
      });
      localStorage.setItem(room.id, JSON.stringify(messages));
  }, [gHead.focused_room])
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    console.log(room.id, 'here is somethign fun')
    sendMessage(room.id, newMessage, gHead.auth_token)
    setNewMessage("");
  };

  const handleMessage = (data) => {
    if(data.code == 200){
    const newMsg = {
      id: messages.length + 1,
      text: data.content,
      sent: data.origin == gHead.user?.id,
      sender_id: gHead.user?.id,
      time: new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "DELIVERED",
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
    }else{
      pushMessage(data.message, 'error')
    }
  };
  // useEffect(()=>{
  //   if(gHead.onMessage){
  //   handleMessage(gHead.onMessage)
  //   }
  //   return addGHead("onMessage",null)
  // },[gHead.onMessage])

  const { sendMessage } = useGroupSocket({
    onMessage: handleMessage,
  });
  const renderMessageStatus = (status) => {
    const className = status === "read" ? "status-icon read" : "status-icon";
    return <CheckOutlined className={className} />;
  };

const bottomRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: isFirstLoad ? "auto" : "smooth", // jump on first load
      });
      if (isFirstLoad) setIsFirstLoad(false); // turn off after first scroll
    }
  }, [gHead.focused_room]);
  return (
    <div className="chat-container">
     

      <div className="chat-header">
        <div className="chat-avatar">
        </div>
        <div>
        {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
          <h2 className="chat-name">{room.title}</h2>
          <p className="chat-status">{getDate(new Date(room.created_at))} | created by : {room.Owner.name}</p>
          <p style={{
            textAlign: "right",
            margin:'0',
            fontSize: "10px",
            fontWeight: "500",
          }}
          onClick={()=>{
            setShowQuestion(!showQuestion)
          }}
          >
            More Info
          </p>
        </div>
       {showQuestion &&  <div className="chat-desc">
            <CloseOutlined onClick={()=>{
                setShowQuestion(false)
            }}/>
            <p style={{
                fontSize: "17px",
                fontWeight: "500",
            }}>{room.title}</p>
            <p className="cr_und">
                {" "}
                {getDate(new Date(room.created_at))} | created by : {room.Owner.name}
              </p>
            <p className="chat-description">{room.description}</p>

        </div>}
      </div>

      <div className="chat-body">
        <div className="chat-messages" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
          {gHead.focused_room?.map((message, x) => {
            message.sent = message.origin == gHead.user?.id
            return(
            <div key={x} className={`message-row ${message.sent ? "sent" : "received"}`}>
              <div className={`message-bubble ${message.sent ? "sent-bubble" : "received-bubble"}`}>
                <p className="message-text">{message.content}</p>
                <div className="message-meta">
                  <span className="message-time">{message.time}</span>
                  {message.sent && renderMessageStatus(message.status)}
                </div>
              </div>
            </div>
          )})}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="chat-input">
        <div className="icon-button"><SmileOutlined /></div>
        <div className="icon-button"><PaperClipOutlined /></div>
        <input
          type="text"
          placeholder="Type a message"
          className="input-field"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onFocus={()=>{
            addGHead("keyboard", true);
          }}
          onBlur={() => {
            setTimeout(() => {
              addGHead("keyboard", undefined);
            }, 100);
            console.log("onblure");
          }}
          
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <div className="icon-button" onClick={handleSendMessage}>
          {newMessage.trim() === "" ? <MicOutlined /> : <SendOutlined />}
        </div>
      </div>
    </div>
  );
}

export default ChatThread;
