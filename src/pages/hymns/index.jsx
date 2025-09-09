import CButton from "../../components/buttton";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import "../../assets/styles/hymn.css";
import { getHymnBookCached } from "@/hymns/cache";
import { SearchOutlined } from "@mui/icons-material";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useGiraf } from "../../giraf";
import HymnLanguage from "./en_lister";
const Hymns = () => {
  const [searchText, setSearchText] = useState(null);
  const [lan, setLan] = useState("ADH");
  const [data, setData] = useState([]);
  const { gHead, addGHead } = useGiraf();
  const [song, setSong] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);
  useEffect(() => {
    // Load default hymnbook lazily
    let active = true;
    setLoadingBook(true);
    getHymnBookCached(lan).then((d)=>{
      if (!active) return;
      setData(d);
      setSong(d[0]);
      setLoadingBook(false);
    }).catch(()=> setLoadingBook(false));
    return ()=>{ active=false };
  }, []);
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
                <p className="disp_n">{song?.number?.padStart(3, "0") || ''}</p>
                <p className="disp_t">{song?.title || (loadingBook ? 'Loading…' : 'Select a hymn')}</p>
              </div>
              <div className="scroller">
                {Object.keys(song || {})
                  .filter((l) => l.includes("verse"))
                  .map((v) => {
                    return (
                      <>
                        <p className="disp_v">{song?.[v]}</p>
                        {song?.refrain && <p className="disp_v">{song.refrain}</p>}
                      </>
                    );
                  })}
                {!song && (
                  <div style={{ padding: '12px', color: '#666', fontSize: 12 }}>
                    {loadingBook ? <LoadingOutlined /> : 'No hymn selected'}
                  </div>
                )}
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
                        setLoadingBook(true);
                        setLan(d.code);
                        getHymnBookCached(d.code).then((book)=>{
                          setData(book);
                          if (gHead.s_n) {
                            const found = book.find((t)=> t.number === gHead.s_n);
                            setSong(found || book[0]);
                          } else {
                            setSong(book[0]);
                            addGHead("search", true);
                          }
                        }).finally(()=> setLoadingBook(false));
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
