import CButton from "../../components/buttton";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import "../../assets/styles/hymn.css";
import en_eng from "../../assets/db/n_eng_db.json";
import en_swa from "../../assets/db/n_swa_db.json";
import en_luo from "../../assets/db/n_luo_db.json";
import { SearchOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useGiraf } from "../../giraf";
import HymnLanguage from "./en_lister";
const Hymns = () => {
  const [searchText, setSearchText] = useState(null);
  const [lan, setLan] = useState("ADH");
  const [data, setData] = useState(en_eng);
  const dlang = {
    ADH: en_eng,
    NZK: en_swa,
    DHO: en_luo,
  };
  const { gHead, addGHead } = useGiraf();
  const [song, setSong] = useState(data[0]);
  const language = [
    { name: "English", code: "ADH" },
    { name: "Swahili", code: "NZK" },
    { name: "Dholuo", code: "DHO" },
  ];
  return (
    <div className="hymns nav_page">
      <div
        className="p_header"
        style={{
          justifyContent: "flex-end",
          backgroundColor: "white",
        }}
      >
        <LanguageOutlinedIcon
          style={{
            marginRight: "7%",
          }}
        />
        <div>
          <CButton
            text={"ADH"}
            style={{
              fontSize: "12px",
              paddingLeft: "18px",
              paddingRight: "18px",
              textWrap: "nowrap",
              marginLeft: "-30%",
              width: "100%",
            }}
            onClick={() => {
              addGHead("lsearch", true);
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="l">
          {(gHead.search || gHead.lsearch) && (
            <div className="searchBox">
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
                />
              </div>
            </div>
          )}
          {(gHead.search && !gHead.lsearch)&& (
            <div className="lister">
              {data
                .filter((t) => {
                  if (searchText) {
                    let txt = searchText.toLowerCase();
                    return (
                      t.title.toLocaleLowerCase().includes(txt) ||
                      t.number.includes(txt)
                    );
                  } else {
                    return true;
                  }
                })
                .map((d, x) => {
                  return (
                    <div
                      className="row"
                      onClick={() => {
                        addGHead("search", false);
                        addGHead("s_n", d.number);
                        setSong(d);
                      }}
                    >
                      <div className="c_1">{d.number.padStart(3, "0")}</div>
                      <div className="c_2">{d.title}</div>
                    </div>
                  );
                })}
            </div>
          )}
          {!gHead.search && !gHead.lsearch && (
            <div className="h_disp">
              <div className="hd">
                <p className="disp_n">{song?.number.padStart(3, "0")}</p>
                <p className="disp_t">{song?.title}</p>
              </div>
              <div className="scroller">
                {Object.keys(song)
                  .filter((l) => l.includes("verse"))
                  .map((v) => {
                    return (
                      <>
                        <p className="disp_v">{song[v]}</p>
                        <p className="disp_v">{song.refrain}</p>
                      </>
                    );
                  })}
                <div></div>
              </div>
            </div>
          )}
          {gHead.lsearch && (
            <div className="hymn_language">
              {language
                .filter((t) => {
                  if (searchText) {
                    let txt = searchText.toLowerCase();
                    return (
                      t.title.toLocaleLowerCase().includes(txt) ||
                      t.number.includes(txt)
                    );
                  } else {
                    return true;
                  }
                })
                .map((d, x) => {
                  return (
                    <div
                      className="row"
                      onClick={() => {
                        addGHead("lsearch", false);
                        setData(dlang[d.code]);
                        if (gHead.s_n) {
                          setSong(
                            dlang[d.code].filter(
                              (t) => t.number === gHead.s_n
                            )[0]
                          );
                          addGHead("search", true);
                        } else {
                          setSong(dlang[d.code][0]);
                          addGHead("search", true);
                        }
                      }}
                    >
                      <p
                        className="c_1"
                        style={{
                          fontWeight: "bold",
                          color: "#000",
                          borderBottom: "1px solid gray",
                          textAlign: "left",
                          margin: "0",
                          marginLeft: "14%",
                          marginRight: "14%",
                          padding: "2%",
                        }}
                      >
                        {d.code} - {d.name}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hymns;
