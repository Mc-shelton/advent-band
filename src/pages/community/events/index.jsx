import RepeatIcon from "@mui/icons-material/Repeat";
import testImage from "../../../assets/images/dailybread.jpg";
import { useEffect, useState } from "react";
import { useGiraf } from "../../../giraf";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
import Loading from "../../../components/loading";
import MessageBox from "../../../components/message";
import { getDate } from "../../../../bff/lib/utils";
const Events = () => {
  const { gHead, addGHead } = useGiraf();
  const {actionRequest} = useGetApi()
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState("");
  const [events, setEvents] = useState([])


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


  useEffect(()=>{
    setLoading(true)
    actionRequest({endPoint:`${baseUrl}events`}).then((res)=>{
      setEvents(res.data)
    }).catch((err)=>{
      pushMessage(err.message, 'error')
    }).finally(()=>{
      setLoading(false)
    })
  },[])
  return (
    <div
      className="comm_events"
      
    >
      {loading && <Loading />}
      {message && (
        <MessageBox txt={message} type={messageType} key={"some key"} />
      )}
      <p className="comm_titles" style={
        {
          marginTop: "0px",
          paddingLeft: "5%",
        }
      }>Events</p>
      {events.map(event=>{
        return(
          
          <div className="ce_card" key={event.id}
          onClick={() => {
            addGHead("comm_page", 'ev_page');
            let prev = gHead.comm_page_prev || [];
            addGHead("comm_page_prev", ["events"]);
            addGHead("prev_view_key", 'comm_page')
            addGHead("prev_view_value", 'ev_main')
            addGHead("focused_event", event)
          }}
          >
        <div
          className="ce_card_img"
          style={{
            backgroundImage: `url(${event.image})`,
          }}
        ></div>
        <p className="ce_p1">{event.organizer}, {event.location}</p>
        <p className="ce_p2">{getDate(new Date(event.date))}</p>
        <p className="ce_p3">
          <RepeatIcon
            style={{
              fontSize: "12px",
              marginRight: "5px",
            }}
          />{" "}
          {event.repeat}
        </p>
        <p className="ce_p4">{event.title}</p>
      </div>
        )
      })}
    </div>
  );
};

export default Events;
