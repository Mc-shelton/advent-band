import RepeatIcon from "@mui/icons-material/Repeat";
import testImage from "../../../assets/images/dailybread.jpg";
import "../../../assets/styles/events.css";
import { useGiraf } from "../../../giraf";
import { useEffect, useState } from "react";
import { getDate } from "../../../../bff/lib/utils";

const EventPage = () => {
  const {gHead}= useGiraf()
  const [event, setEvent] = useState(gHead.focused_event)
  // useEffect(()=>{
  //   setEvent(gHead.focused_event)
  // },[])
  return (
    <div className="ce_page">
      <div className="ce_card">
        <div
          className="ce_card_img"
          style={{
            backgroundImage: `url(${event.image})`,
          }}
        ></div>
        <p className="ce_p1">{event.location}</p>
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
      <div className="ce_pd">
        {event.contact && <p className="ce_pd_p">Contact : {event.contact}</p>}
        {event.locationPin && <p className="ce_pd_p">
          Pin : <a href={event.locationPin}>Google Pin</a>
        </p>}
        {event.formLink && <p className="ce_pd_p">
          Reserve Here : <a href={event.formLink}>Form</a>

        </p>}
        <p
          className="ce_pd_p"
          style={{
            marginTop: "15px",
          }}
        >
          Description
        </p>
        <p className="ce_pd_p desc">
          {event.description}
        </p>
        <div className="ce_gal">
            <p>Gallery</p>
            <div className="ce_gal_cont">
                
                {event.Gallary.length > 0 ? event.Gallary.map(image=>{
                  return(
                    <img  className="ce_gal_img" src={testImage} onClick={(e)=>{
                      let position = e.target.style.position
                      e.target.style.position = position != 'absolute' ? 'absolute' : 'relative'
                      e.target.style.top = '10%'
                      e.target.style.width =  position == 'absolute' ? '45%':'100%'
  
                  }}/>
                  )
                })
                :
                <p style={{
                  textDecoration:'none'
                }}>no images for this event</p>
              }
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
