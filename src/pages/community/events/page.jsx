import RepeatIcon from "@mui/icons-material/Repeat";
import testImage from "../../../assets/images/dailybread.jpeg";
import "../../../assets/styles/events.css";

const EventPage = () => {
  return (
    <div className="ce_page">
      <div className="ce_card">
        <div
          className="ce_card_img"
          style={{
            backgroundImage: `url(${testImage})`,
          }}
        ></div>
        <p className="ce_p1">Nairobi</p>
        <p className="ce_p2">14th Fri, April 2025</p>
        <p className="ce_p3">
          <RepeatIcon
            style={{
              fontSize: "12px",
              marginRight: "5px",
            }}
          />{" "}
          Every 1st Fridady
        </p>
        <p className="ce_p4">Street Vesperse - Agha Khan Walk</p>
      </div>
      <div className="ce_pd">
        <p className="ce_pd_p">Contact : 0741741381</p>
        <p className="ce_pd_p">
          Pin : <a href="#">Google Pin</a>
        </p>
        <p className="ce_pd_p">
          Reserve Here : <a href="https://google.com">Form</a>

        </p>
        <p
          className="ce_pd_p"
          style={{
            marginTop: "15px",
          }}
        >
          Description
        </p>
        <p className="ce_pd_p desc">
          Spirit lead me where my trust is without boarders, let me walk upon
          the waters, wherever you would call me! take me deeper than my feet
          will ever wander
        </p>
        <div className="ce_gal">
            <p>Gallery</p>
            <div className="ce_gal_cont">
                <img  className="ce_gal_img" src={testImage} onClick={(e)=>{
                    let position = e.target.style.position
                    e.target.style.position = position != 'absolute' ? 'absolute' : 'relative'
                    e.target.style.top = '10%'
                    e.target.style.width =  position == 'absolute' ? '45%':'100%'

                }}/>
                <img className="ce_gal_img" src={testImage}/>
                <img  className="ce_gal_img" src={testImage}/>
                <img  className="ce_gal_img" src={testImage}/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
