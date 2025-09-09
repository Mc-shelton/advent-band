import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl, useGetApi } from "../../../bff/hooks";
import "../../assets/styles/egw.css";
import { ArrowBackOutlined } from "@mui/icons-material";

const EgwViewer = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([1, 2]);
  const location = useLocation();
  const { actionRequest } = useGetApi();
  const [pressTimeout, setPressTimeout] = useState(null);

  const { id_pub ,maxpuborder, splash, title, url} = location.state || {};

  useEffect(() => {
    console.log(id_pub, maxpuborder);
    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}/estate/egw/content`,
      params: {
        id_pub,
        maxpuborder, 
      },
    })
      .then((res) => {
        console.log("###########", res.data.elements.midd);
        setContent(res.data.elements.middle);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const navigate = useNavigate()

  const handleLongPress = (event) => {
    // Handle the long press event here
    event.target.style.backgroundColor = 'yellow'; // Example: highlight on long press
    event.target.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
      event.target.style.backgroundColor = ''; // Reset after 2 seconds
    }, 2000);
    console.log("Long press triggered!");
  };
  const handleMouseDown = (event) => {
    setPressTimeout(setTimeout(() => handleLongPress(event), 800)); // 800ms for long press
  };
  const handleClick = () => {};

  return (
    <div className="egw_viewer nav_page">
      <div
        className="lsn_back"
        onClick={() => {
          navigate("/estate/egw", {
            state: {
                splash,
                title,
                url
              },
          });
        }}
      >
        <ArrowBackOutlined />
      </div>
      <div className="reader">
        <div className="reader_inner">
          {loading ? (
            <div>Loading...</div>
          ) : (
            content.map((t, x) => {
              return (
                t.html?.length > 270 && (
                  <div
                    // onMouseDown={handleMouseDown}
                    onClick={(event) => {
                      event.target.style.color != "orange"
                        ? (event.target.style.color = "orange")
                        : (event.target.style.color = "black");
                    }}
                    key={x}
                    dangerouslySetInnerHTML={{ __html: t.html }}
                  />
                )
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EgwViewer;
