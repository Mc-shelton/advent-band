import { SearchOutlined } from "@mui/icons-material";
import "../../assets/styles/estate.css";
import { useGiraf } from "../../giraf";
import { useEffect, useState, useRef } from "react";
import testImage from "../../assets/images/dailybread.jpg";
import LazyBg from "../../components/LazyBg";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import useAxios from "../../hooks/useAxios";
import { baseUrl, useGetApi } from "../../../bff/hooks";
import { createWarmupController, warmUpAbcLibrary } from "@/estate/cache";
import { useNavigate } from "react-router-dom";
import egwLogo from '../../assets/images/egw_logo.png'
import pioneers from '../../assets/images/pioneers.jpeg'
import testPdf from '../../assets/testData/test.pdf'
import { maybeUpdateServiceWorker } from '@/lib/swUpdate';

const Estate = () => {
  const { gHead, addGHead } = useGiraf();
  const [searchText, setSearchText] = useState();
  const testList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [focused, setFocused] = useState();
  const [lesson, setLesson] = useState([]);
  const [switchMenus, setSwitchmenus] = useState(false);
  const { actionRequest } = useGetApi();
  const [egw, setEgw] = useState([]);
  const [library, setLirary] = useState([])
  const [loading, setLoading] = useState(false);
  const [pioneer, setPioneer] = useState([])
  // ABC Library download session
  const [dlAbc, setDlAbc] = useState({ active:false, current:0, total:0, label:'', paused:false });
  const [abcSaving, setAbcSaving] = useState({}); // url => bool
  const [abcSaved, setAbcSaved] = useState({});   // url => bool
  const warmRefAbc = useRef(null);
  const SESSION_ABC = 'abcLibraryDl';
  const saveAbc = (s)=>{ try{ localStorage.setItem(SESSION_ABC, JSON.stringify(s)); }catch{} };
  const loadAbc = ()=>{ try{ const v = localStorage.getItem(SESSION_ABC); return v? JSON.parse(v): null; }catch{ return null; } };
  const clearAbc = ()=>{ try{ localStorage.removeItem(SESSION_ABC); }catch{} };

  const navigate = useNavigate();
  useEffect(() => {
    // Best-effort SW update when user opens Estate tab; non-blocking.
    maybeUpdateServiceWorker();

    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}estate/pioneers`,
      params: {},
      cacheKey: 'estate_pioneers',
      strategy: 'cache-first',
      cacheTtlMs: 30 * 60 * 1000,
      onUpdate: (res) => setPioneer(res.data)
    })
      .then((res) => {
        setPioneer(res.data)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    actionRequest({
      endPoint: `${baseUrl}estate/quarterlies`,
      params: {},
      cacheKey: 'estate_quarterlies',
      strategy: 'cache-first',
      cacheTtlMs: 30 * 60 * 1000,
      onUpdate: (res) => setLesson(res.data)
    })
      .then((res) => {
        setLesson(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    actionRequest({
      endPoint: `${baseUrl}estate/egw`,
      params: {},
      cacheKey: 'estate_egw',
      strategy: 'cache-first',
      cacheTtlMs: 60 * 60 * 1000,
      onUpdate: (res) => {
        let engFolder = res.data?.find((item) => item.title.toLowerCase().includes("eng"));
        let egwWrittigns = engFolder?.children.find((item) => item.title.toLowerCase().includes("egw"));
        setEgw(egwWrittigns?.children);
      }
    })
      .then((res) => {
        let engFolder = res.data?.find((item) => item.title.toLowerCase().includes("eng"));
        let egwWrittigns = engFolder?.children.find((item) => item.title.toLowerCase().includes("egw"));
        setEgw(egwWrittigns?.children);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    actionRequest({
      endPoint: `${baseUrl}periodicals/books`,
      params: {},
      cacheKey: 'periodicals_books',
      strategy: 'cache-first',
      cacheTtlMs: 30 * 60 * 1000,
      onUpdate: (res) => setLirary(res.data)
    })
      .then((res) => {
       setLirary(res.data)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Resume ABC library download if present
  useEffect(()=>{ const s = loadAbc(); if (s?.active) setDlAbc(s); },[])

  // Track which ABC items are already cached offline
  useEffect(()=> {
    const m = {};
    (library || []).forEach((t)=> {
      const u = t?.url;
      if (u && localStorage.getItem(`abcSaved:${u}`)==='1') m[u]=true;
    });
    setAbcSaved(m);
  }, [library]);

  const cachePdf = async (url) => {
    try{
      const cache = await caches.open('pdf-v1');
      const req = new Request(url, { mode:'cors' });
      const match = await cache.match(req);
      if (match) return true;
      const resp = await fetch(req);
      if (resp && resp.ok) await cache.put(req, resp.clone());
      return true;
    }catch{ return false; }
  };

  const saveAbcItem = async (item) => {
    const url = item?.url; if (!url) return;
    maybeUpdateServiceWorker();
    setAbcSaving((s)=>({ ...s, [url]: true }));
    try{
      const ok = await cachePdf(url);
      if (ok){ localStorage.setItem(`abcSaved:${url}`, '1'); setAbcSaved((s)=>({ ...s, [url]: true })); }
    } finally {
      setAbcSaving((s)=>({ ...s, [url]: false }));
    }
  };

  const startAbcDownload = async () => {
    maybeUpdateServiceWorker();
    const ctrl = createWarmupController();
    warmRefAbc.current = ctrl;
    const sess = { active:true, paused:false, current:0, total:0, label:'Preparing library…' };
    setDlAbc(sess); saveAbc(sess);
    await warmUpAbcLibrary(library, (p)=>{
      setDlAbc((d)=>{ const nd = { ...d, ...p, active:true }; saveAbc(nd); return nd; });
    }, ctrl);
    clearAbc(); setDlAbc({ active:false, current:0, total:0, label:'', paused:false });
  };
  const pauseAbc = ()=>{ const c = warmRefAbc.current; if (!c) return; c.pause(); setDlAbc((d)=>{ const nd={...d, paused:true}; saveAbc(nd); return nd; }); };
  const resumeAbc = ()=>{ const c = warmRefAbc.current; if (c) { c.resume(); setDlAbc((d)=>{ const nd={...d, paused:false}; saveAbc(nd); return nd; }); return; } startAbcDownload(); };
  const cancelAbc = ()=>{ const c = warmRefAbc.current; if (c) c.cancel(); clearAbc(); setDlAbc({ active:false, current:0, total:0, label:'', paused:false }); };

  const snippet = (text, words = 20) => {
    if (!text) return null;
    const str = String(text).trim();
    // Split into sentences; keep punctuation.
    const sentences = str.match(/[^.!?]*[.!?]/g);
    const pick = sentences && sentences.length ? sentences[sentences.length - 1].trim() : str;
    const parts = pick.split(/\s+/).filter(Boolean);
    if (parts.length <= words) return parts.join(' ');
    return parts.slice(0, words).join(' ') + '…';
  };

  const toTitleCase = (text) => {
    if (!text) return '';
    return String(text)
      .split(/\s+/)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
      .join(' ');
  };

  return (
    <div className="nav_page estate">
      <p className="d_tt">ABC Estate</p>
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
      <div
        className="est_container"
        style={{
          overflow: focused && "hidden",
        }}
      >
        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "egw" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">EGW Estate</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "egw";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "egw" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">EGW Estate</p>
          </div>
        )}
        <div
          className={`${
            !focused || focused == "egw"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "egw"
              ? {
                  display: "flex",
                  height: "93%",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  overflow: "scroll",
                  flexDirection: "row",
                }
              : focused
              ? {
                  display: "none",
                }
              : {
                  display: "flex",
                  //   border:'1px solid red',
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  overflow: "scroll",
                  flexDirection: "row",
                }
          }
        >
          {egw.length > 0 ? (
            egw.map((item, index) => {
              return (
                <div
                  className="est_side_lister_item focused"
                  key={index}
                  onClick={() => {
                    // alert()
                    navigate(`/estate/egw`, {
                      state: {
                        splash: item.title || 'splash',
                        title: item.title || 'title',
                        url: item.key,
                      },
                    });
                  }}
                >
                  <LazyBg
                    className="est_side_lister_item_img"
                    src={egwLogo}
                  />
                  <div className="est_side_lister_item_text">
                    <p className="est_side_lister_item_text_hd">{toTitleCase(item.title)}</p>
                    <p className="est_side_lister_item_text_sub">
                      {item.urltype} : EGW {item.addClass}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div>{loading ? <p>Loading...</p> : <p>No data found</p>}</div>
          )}
        </div>

        {/* ######################### */}

        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "pioneer" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">Pioneer Estate</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "pioneer";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "pioneer" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">Pioneer Estate</p>
          </div>
        )}
        <div
          className={`${
            !focused && focused != "pioneer"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "pioneer"
              ? {
                  // border:'1px solid blue',
                  display: "flex",
                  height: "93%",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  overflow: "scroll",
                  flexDirection: "row",
                }
              : focused
              ? {
                  display: "none",
                }
              : {
                  display: "flex",
                  //   border:'1px solid red',
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  overflow: "scroll",
                  flexDirection: "row",
                }
          }
        >
          {pioneer.map((item, index) => {
            return (
              <div className="est_side_lister_item focused" key={index}>
                <LazyBg
                  key={index}
                  className="est_side_lister_item_img"
                  src={pioneers}
                  onClick={() => {
                    // alert()
                    navigate(`/estate/egw`, {
                      state: {
                        splash: item.title || 'splash',
                        title: item.title || 'title',
                        url: item.key,
                      },
                    });
                  }}
                />
                <div className="est_side_lister_item_text">
                  <p className="est_side_lister_item_text_hd">
                    {toTitleCase(item.title)}
                  </p>
                  <p className="est_side_lister_item_text_sub">
                    {item.urltype}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ######################### */}

        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "abc" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">ABC Library</p>
          <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "abc";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "abc" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">ABC Library</p>
          </div>
        )}
        
        <div
          className={`${
            !focused || focused == "abc"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "abc"
              ? {
                  display: "flex",
                  height: "93%",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  overflow: "scroll",
                  flexDirection: "row",
                }
              : focused
              ? {
                  display: "none",
                }
              : {
                  display: "flex",
                  //   border:'1px solid red',
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  overflow: "scroll",
                  flexDirection: "row",
                }
          }
        >
          {library.map((item, index) => {
            return (
              <div className="est_side_lister_item focused" key={index} 
                onClick={()=>{
                  navigate("/viewer/pdf",{
                    state: {
                      back:'estate',
                      path: item.url,
                      src: `${baseUrl}static/read/pdf?pdfUrl=${item.url}`
                    },
                  })
                }}
              >
                <LazyBg
                  className="est_side_lister_item_img"
                  src={item.image || testImage}
                />
                <div className="est_side_lister_item_text">
                  <p className="est_side_lister_item_text_hd">{toTitleCase(item.title)}</p>
                  <p className="est_side_lister_item_text_sub">
                    By : {item.author}
                  </p>
                  { (item.pages || item.page_count || item.pageCount) && (
                    <p className="est_side_lister_item_text_sub">
                      Pgs: {item.pages || item.page_count || item.pageCount} 
                    </p>
                  )}
                  { snippet(item.description) && (
                    <p className="est_side_lister_item_text_sub" style={{ marginTop: 4 }}>
                      {snippet(item.description)}
                    </p>
                  )}
                  <div style={{ marginTop: 6, display:'flex', justifyContent:'flex-start' }}>
                    <button
                      onClick={(e)=>{ e.stopPropagation(); saveAbcItem(item); }}
                      disabled={!!abcSaving[item.url] || !!abcSaved[item.url]}
                      style={{ fontSize:12, padding:'6px 10px', border:'1px solid #0a7ea4', borderRadius:6, background:'#fff', color:'#0a7ea4' }}
                    >
                      {abcSaved[item.url] ? 'Offline ✓' : (abcSaving[item.url] ? 'Saving…' : 'Save offline')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ######################### */}

        {!switchMenus ? (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "local" ? "flex" : "none",
            }}
          >
            <p className="est_long_hd_t">Lesson Quarterly</p>
            <ArrowRightOutlined
              onClick={() => {
                setSwitchmenus(true);
                setFocused((t) => {
                  return "local";
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </div>
        ) : (
          <div
            className="est_long_hd"
            style={{
              display: !focused || focused == "local" ? "flex" : "none",
            }}
          >
            <ArrowLeftOutlined
              onClick={() => {
                setSwitchmenus(false);
                setFocused((t) => {
                  return null;
                });
              }}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <p className="est_long_hd_t">lesson Quarterly</p>
          </div>
        )}
        <div
          className={`${
            !focused || focused == "local"
              ? "est_side_lister"
              : "est_side_lister_focused"
          }`}
          style={
            focused && focused == "local"
              ? {
                  display: "flex",
                  height: "93%",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  overflow: "scroll",
                  flexDirection: "row",
                }
              : focused
              ? {
                  display: "none",
                }
              : {
                  display: "flex",
                  //   border:'1px solid red',
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  overflow: "scroll",
                  flexDirection: "row",
                }
          }
        >
          {lesson.length > 0 ? (
            lesson.map((item, index) => {
              return (
                <div
                  className="est_side_lister_item focused"
                  key={index}
                  onClick={() => {
                    navigate(`/estate/lessons`, {
                      state: {
                        splash: item.splash,
                        title: item.title,
                        path: item.path,
                      },
                    });
                  }}
                >
                  <LazyBg
                    className="est_side_lister_item_img"
                    src={item.cover}
                  />
                  <div className="est_side_lister_item_text">
                    <p className="est_side_lister_item_text_hd">{toTitleCase(item.title)}</p>
                    <p className="est_side_lister_item_text_sub">
                      {item.path.split("/").join(" ")}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div>{loading ? <p>Loading...</p> : <p>No data found</p>}</div>
          )}
        </div>

        {/* ######################### */}
      </div>
    </div>
  );
};

export default Estate;
