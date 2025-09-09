import CButton from "../../components/buttton";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import "../../assets/styles/hymn.css";
import "../../assets/styles/bible.css";
import { AddHome, SearchOutlined, TurnedIn } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useGiraf } from "../../giraf";
import useAxios from "../../hooks/useAxios";
import { getBooksCached, getChaptersCached, getPassageCached, warmUpBible, isBibleReady, createWarmupController } from "@/bible/cache";
import { LoadingOutlined } from "@ant-design/icons";
const Bible = () => {
  const [searchText, setSearchText] = useState(null);
  const { gHead, addGHead } = useGiraf();
  const [song, setSong] = useState(null);
  // If hymn data is needed here, load on demand to avoid blocking route mount
  // useEffect(() => { import('../../assets/db/n_eng_db.json').then(m => setSong((m.default||[])[0]||null)) }, []);
  const [bookIndex, setBookIndex] = useState();
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passage, setPassage] = useState("");
  const [bibleId, setBibleId] = useState("611f8eb23aec8f13-01");
  const [bibleLists, setBibleLists] = useState([]);
  const [showBooks, setShowBooks] = useState(true);
  const [getBible, setGetBible] = useState(false);
  const [bAbr, setBAbr] = useState("SHB");

  const [current, setCurrent] = useState({
    book: "",
    chapter: "",
  });
  const { get } = useAxios("https://api.scripture.api.bible/v1/", {
    "api-key": "00c2980d52fea9afa145a2d3c6d5c8c5",
  });
  const fetcher = async (path) => {
    const res = await get(path, { ttl: 30 * 24 * 60 * 60 * 1000 });
    return res;
  };
  const [dl, setDl] = useState({ active: false, current: 0, total: 0, label: "", paused:false });
  const [showPrompt, setShowPrompt] = useState(false);
  const warmRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setBooks([]);
    getBooksCached(bibleId, fetcher)
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bibleId]);


  const getBibles = () => {
    if (bibleLists.length > 0) {
      setBookIndex((t) => "90");
      setSearchText((t) => "");
      return
    }
    setLoading(true);
    // Cache available bibles list (7 days)
    get(`bibles`, { ttl: 7*24*60*60*1000 })
      .then((res) => {
        setBibleLists(res.data);
        setBookIndex((t) => "90");
        setSearchText((t) => "");
        setLoading(false);
      })
      .catch((err) => {
        console.log("An error occured");
      });
  };

  const getChapters = (id) => {
    // Chapters with persistent cache
    getChaptersCached(bibleId, id, fetcher)
      .then((data) => {
        setChapters(data);
        setLoading(false);
      })
      .catch(() => {});
  };

  const getVerses = (id, book, chapter) => {
    getPassageCached(bibleId, id, fetcher)
      .then((data) => {
        const content = data?.content || data?.data?.content || '';
        setPassage(content);
        setLoading(false);
        addGHead("bsearch", false);
      })
      .catch(() => {});
  };

  // Offer to warm up entire bible on first load for offline use
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ready = await isBibleReady(bibleId);
      if (ready) return; // already cached
      setShowPrompt(true);
    })();
    return () => { cancelled = true; };
  }, [bibleId]);

  const startDownload = async () => {
    setShowPrompt(false);
    const ctrl = createWarmupController();
    warmRef.current = ctrl;
    setDl({ active: true, current: 0, total: 0, label: 'Preparing…', paused:false });
    await warmUpBible(bibleId, fetcher, (p) => {
      setDl((d)=>({ ...d, active:true, current: p.current, total: p.total, label: p.label }));
    }, ctrl);
    setTimeout(() => setDl({ active: false, current: 0, total: 0, label: '', paused:false }), 1200);
  };
  const pauseDownload = () => {
    const c = warmRef.current; if (!c) return; c.pause(); setDl((d)=>({ ...d, paused:true }));
  };
  const resumeDownload = () => {
    const c = warmRef.current; if (!c) return; c.resume(); setDl((d)=>({ ...d, paused:false }));
  };
  const cancelDownload = () => {
    const c = warmRef.current; if (!c) return; c.cancel(); setDl({ active:false, current:0, total:0, label:'', paused:false });
  };
  return (
    <div className="bible nav_page">
      {showPrompt && (
        <div style={{ position:'sticky', top:0, zIndex:60, background:'#fff', borderBottom:'1px solid #eee', padding:'10px 12px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:12, color:'#333', flex:1 }}>Make this Bible available offline?</div>
          <button onClick={startDownload} style={{ fontSize:12, padding:'6px 10px' }}>Download</button>
          <button onClick={()=>setShowPrompt(false)} style={{ fontSize:12, padding:'6px 10px' }}>Later</button>
        </div>
      )}
      {dl.active && (
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', padding: '8px 12px', borderBottom: '1px solid #eee', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#333' }}>{dl.label || 'Downloading bible…'}</div>
            <div style={{ height: 4, background: '#f2f2f2', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
              <div style={{ width: (dl.total ? Math.floor((dl.current/dl.total)*100) : 0) + '%', height: '100%', background: '#0a7ea4' }} />
            </div>
          </div>
          <div style={{ fontSize: 12, color:'#555', minWidth: 60, textAlign:'right' }}>{dl.total ? Math.floor((dl.current/dl.total)*100) : 0}%</div>
          {!dl.paused ? (
            <button onClick={pauseDownload} style={{ fontSize:12, padding:'6px 10px' }}>Pause</button>
          ) : (
            <button onClick={resumeDownload} style={{ fontSize:12, padding:'6px 10px' }}>Resume</button>
          )}
          <button onClick={cancelDownload} style={{ fontSize:12, padding:'6px 10px' }}>Cancel</button>
        </div>
      )}
      <div
        className="p_header"
        style={{
          justifyContent: "flex-end",
          backgroundColor:'white'
        }}
      >
        <LanguageOutlinedIcon
          style={{
            marginRight: "7%",
          }}
        />
        <div>
          <CButton
            text={bAbr}
            onClick={() => {
              addGHead("bsearch", true);
              addGHead("showBooks", false)
              setGetBible(true);
              getBibles();
            }}
            style={{
              fontSize: "12px",
              paddingLeft: "18px",
              paddingRight: "18px",
              textWrap: "nowrap",
              marginLeft: "-30%",
              width: "100%",
            }}
          />
        </div>
      </div>
      {!gHead.bsearch && (
        <div className="bcontainer">
          <h2>
            {current.book} <br/>{current.chapter}
          </h2>
          {loading && <LoadingOutlined />}
          <div dangerouslySetInnerHTML={{ __html: passage }}></div>
        </div>
      )}
      {gHead.bsearch && (
        <div className="searchBox" style={{
          marginTop:'10%'
        }}>
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
      {getBible && (
        <div className="blister bibles">
          {loading && <LoadingOutlined />}
          {bibleLists
            .filter(
              (b) =>
                b.name.toLowerCase().includes(searchText.toLowerCase()) ||
                b.language.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                b.abbreviation.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((b) => {
              return (
                <div
                  onClick={() => {
                    setBibleId(b.id);
                    setBAbr(b.abbreviation);
                    setGetBible(false);
                    addGHead("showBooks", true)
                    setLoading(false);
                  }}
                  className="bible_list"
                >
                  {b.name}
                </div>
              );
            })}
        </div>
      )}
      {gHead.bsearch && gHead.showBooks && (
        <div className="blister" style={{
          paddingTop:'10%'
        }}>
          {books.map((l, x) => {
            return (
              <div className="book">
                <p
                  className="btitle"
                  onClick={() => {
                    setLoading(true);
                    if (bookIndex == x) return setBookIndex((t) => null);
                    setBookIndex(x);
                    getChapters(l.id);
                  }}
                >
                  {l.name}
                </p>
                {bookIndex == x && (
                  <div className="chapters">
                    {loading ? (
                      <div>
                        <LoadingOutlined />
                      </div>
                    ) : (
                      chapters.map((chp) => {
                        return (
                          <p
                            onClick={() => {
                              setCurrent({
                                chapter: chp.number,
                                book: l.name,
                              });
                              addGHead("s_t", "Bible");
                              // Store a dedicated bible reference for the mini-tab label
                              addGHead("bible_ref", `${l.name || 'Genesis'} ${chp.number || '01'}`);
                              // Keep legacy s_n updates if other parts rely on it
                              // addGHead("s_n", `${l.name} ${chp.number}`);
                              getVerses(chp.id);
                            }}
                          >
                            {chp.number}
                          </p>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bible;
