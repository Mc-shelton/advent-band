import { useState } from "react";
import { MicOutlined } from "@mui/icons-material";
import { CheckOutlined, CloseOutlined, DownCircleOutlined, DownOutlined, PaperClipOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import { useGiraf } from "../../../giraf";

function ChatThread() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how are you doing?", sent: false, time: "09:41", status: "read" },
    { id: 2, text: "I'm good, thanks! Just finished that project we were working on.", sent: true, time: "09:42", status: "read" },
    { id: 3, text: "That's great! Can you send me the files when you get a chance?", sent: false, time: "09:45", status: "read" },
    { id: 4, text: "Sure, I'll email them to you in a bit.", sent: true, time: "09:46", status: "read" },
    { id: 5, text: "Also, are we still meeting for coffee tomorrow?", sent: false, time: "09:48", status: "read" },
    { id: 6, text: "Yes, definitely! How about 10am at the usual place?", sent: true, time: "09:50", status: "delivered" },
    { id: 7, text: "Perfect, see you then!", sent: false, time: "09:51", status: "sent" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const { gHead, addGHead } = useGiraf();
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const renderMessageStatus = (status) => {
    const className = status === "read" ? "status-icon read" : "status-icon";
    return <CheckOutlined className={className} />;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">
            TM
        </div>
        <div>
          <h2 className="chat-name">Where do people go when they die?</h2>
          <p className="chat-status">Thur 12, July 2025 | created by : somefancy Name</p>
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
            }}>Where do people go when they die?</p>
            <p className="cr_und">
                {" "}
                Thur 12, July 2025 | created by : somefancy Name
              </p>
            <p className="chat-description">This is a description of the chat thread. It can include details about the topic of discussion,
                 participants, and any other relevant information.</p>

        </div>}
      </div>

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.sent ? "sent" : "received"}`}>
              <div className={`message-bubble ${message.sent ? "sent-bubble" : "received-bubble"}`}>
                <p className="message-text">{message.text}</p>
                <div className="message-meta">
                  <span className="message-time">{message.time}</span>
                  {message.sent && renderMessageStatus(message.status)}
                </div>
              </div>
            </div>
          ))}
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
