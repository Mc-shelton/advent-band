import { SearchOutlined } from "@mui/icons-material";
import "../../assets/styles/discover.css";
import { useEffect, useState } from "react";
import { useGiraf } from "../../giraf";
import testAvator from "../../assets/images/dailybread.jpg";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../bff/hooks";
import LazyBg from "../../components/LazyBg";
import articles from "../../assets/db/articles_db.json";
import toCamelCase from "../../../bff/lib/toCamelCase";

const Discover = () => {
  const [searchText, setSearchText] = useState("");
  const { gHead, addGHead } = useGiraf();
  const [periodicals, setPeriodicals] = useState(articles);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  // Use only local bundled data for Discover
  // No network fetch here to avoid blank state changes
  useEffect(() => {
    setPeriodicals(articles);
  }, []);

  return (
    <div className="discover nav_page">
      <p className="d_tt">Discover</p>
      <div className="d_search">
        <div className="search">
          <SearchOutlined />
          <input
            className="s_i"
            placeholder="search text..."
            value={searchText}
            onChange={(t) => {
              setSearchText(t.target.value);
            }}
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
            style={{
              backgroundColor: " rgb(244,244,244)",
            }}
          />
        </div>
      </div>
      <div className="slid_butts">
        {[...new Set((periodicals || []).map((item) => item.category || ""))]
          .filter(Boolean)
          .map((item) => {
            return (
              <p
                key={item}
                onClick={() => setFilter((prev) => item)}
                style={{
                  border: filter == item && "1px solid gray",
                }}
              >
                {item}
              </p>
            );
          })}
      </div>
      <div className="ds_container">
        {periodicals
          .filter((item) => (filter ? item?.category == filter : true))
          .filter((item) =>
            searchText
              ? item?.title.toLowerCase().includes(searchText.toLowerCase()) ||
                item?.author.toLowerCase().includes(searchText.toLowerCase())
              : true
          )
          .map((item, index) => (
            <div
              className="ds_box"
              key={item?.id}
              onClick={() => {
                navigate("/viewer/pdf", {
                  state: {
                    back: "discover",
                    path: item?.url,
                    src: `${baseUrl}static/read/pdf?pdfUrl=${item?.url}`,
                  },
                });
              }}
            >
              <br />

              <LazyBg
                className="ds_box_ava"
                src={item?.thumbNail || testAvator}
              />
              <br />
              <p className="ds_box_t">
                <ClockCircleOutlined /> {item?.avTime} Read
              </p>
              <p className="ds_box_t">By : {item?.author || "Unkown"}</p>
              {/* <br/> */}
              <p className="ds_box_hd">{toCamelCase(item?.title)}</p>
              <div
                style={{
                  height: "15px",
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Discover;
