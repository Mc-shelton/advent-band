import CButton from "../../components/buttton";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import "../../assets/styles/hymn.css";
import "../../assets/styles/bible.css";
import { AddHome, SearchOutlined, TurnedIn } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGiraf } from "../../giraf";
import useAxios from "../../hooks/useAxios";
import { getBooksCached, getChaptersCached, getPassageCached, warmUpBible, isBibleReady, createWarmupController } from "@/bible/cache";
import { LoadingOutlined } from "@ant-design/icons";
const Bible = () => {
  const [searchText, setSearchText] = useState("");
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
  const [downloadedIds, setDownloadedIds] = useState([]);
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
  const location = useLocation();

  // Persistable download session helpers
  const SESSION_KEY = 'bibleDlSession';
  const saveSession = (s) => {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
  };
  const loadSession = () => {
    try { const v = localStorage.getItem(SESSION_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
  };
  const clearSession = () => { try { localStorage.removeItem(SESSION_KEY); } catch {} };

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


  const recomputeDownloaded = async (list = []) => {
    try {
      const ids = [];
      for (const b of list) {
        try { if (await isBibleReady(b.id)) ids.push(b.id); } catch {}
      }
      setDownloadedIds(ids);
    } catch {}
  };

  const getBibles = () => {
    if (bibleLists.length > 0) {
      setBookIndex((t) => "90");
      setSearchText((t) => "");
      recomputeDownloaded(bibleLists);
      return
    }
    setLoading(true);
    // Cache available bibles list (7 days)
    get(`bibles`, { ttl: 7*24*60*60*1000 })
      .then((res) => {
        const list = res.data || [];
        setBibleLists(list);
        setBookIndex((t) => "90");
        setSearchText((t) => "");
        recomputeDownloaded(list);
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

  // Utilities to parse and navigate bible references
  const parseRef = (ref) => {
    if (!ref) return { book: current.book, chapter: parseInt(current.chapter||'1',10)||1 };
    const parts = String(ref).trim().split(/\s+/);
    const ch = parseInt(parts.pop()||'1',10)||1;
    const bk = parts.join(' ');
    return { book: bk, chapter: ch };
  };

  useEffect(() => {
    if (!gHead?.bible_nav) return;
    const dir = gHead.bible_nav; // 'prev' | 'next'
    (async () => {
      try{
        // ensure books loaded
        const allBooks = (await getBooksCached(bibleId, fetcher)) || [];
        const { book: curBookName, chapter: curCh } = parseRef(gHead.bible_ref || `${current.book} ${current.chapter}`);
        let bIdx = Math.max(0, allBooks.findIndex((b)=> b.name === curBookName));
        if (bIdx < 0) bIdx = 0;
        let chaptersList = await getChaptersCached(bibleId, allBooks[bIdx].id, fetcher);
        let chIdx = Math.max(0, (chaptersList.findIndex((c)=> parseInt(c.number,10) === curCh)));
        if (dir === 'next') {
          chIdx++;
          if (chIdx >= chaptersList.length) { bIdx = Math.min(allBooks.length-1, bIdx+1); chaptersList = await getChaptersCached(bibleId, allBooks[bIdx].id, fetcher); chIdx = 0; }
        } else {
          chIdx--;
          if (chIdx < 0) { bIdx = Math.max(0, bIdx-1); chaptersList = await getChaptersCached(bibleId, allBooks[bIdx].id, fetcher); chIdx = Math.max(0, chaptersList.length-1); }
        }
        const nextBook = allBooks[bIdx];
        const nextCh = chaptersList[chIdx];
        if (nextBook && nextCh){
          setCurrent({ book: nextBook.name, chapter: nextCh.number });
          addGHead('bible_ref', `${nextBook.name} ${nextCh.number}`);
          getVerses(nextCh.id);
        }
      } finally {
        addGHead('bible_nav', undefined);
      }
    })();
  }, [gHead?.bible_nav]);

  // Offer to warm up entire bible on first load for offline use
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // If there is an unfinished session, offer to resume
      const sess = loadSession();
      if (sess?.active && sess?.bibleId) {
        setBibleId(sess.bibleId);
        setDl({ active: true, current: sess.current||0, total: sess.total||0, label: sess.label||'Resumable download found', paused: !!sess.paused });
        setShowPrompt(false);
        return;
      }
      const ready = await isBibleReady(bibleId);
      if (ready) return; // already cached
      setShowPrompt(true);
    })();
    return () => { cancelled = true; };
  }, [bibleId]);

  // When returning to Bible and a previous reference exists, load it directly (inside component)
  useEffect(() => {
    (async () => {
      if (location?.pathname !== '/bible') return;
      if (!gHead?.bible_ref || gHead?.bsearch) return;
      try{
        const allBooks = (await getBooksCached(bibleId, fetcher)) || [];
        if (!Array.isArray(allBooks) || allBooks.length === 0) return;
        const { book: refBook, chapter: refChapter } = parseRef(gHead.bible_ref);
        const b = allBooks.find((bk)=> bk?.name === refBook) || allBooks[0];
        if (!b) return;
        const chs = (await getChaptersCached(bibleId, b.id, fetcher)) || [];
        if (!Array.isArray(chs) || chs.length === 0) return;
        const ch = chs.find((c)=> parseInt(c.number,10) === refChapter) || chs[0];
        if (!ch) return;
        setCurrent({ book: b.name, chapter: ch.number });
        getVerses(ch.id);
      }catch{}
    })();
  }, [location?.pathname, gHead?.bsearch, gHead?.bible_ref, bibleId]);

  const startDownload = async () => {
    setShowPrompt(false);
    const ctrl = createWarmupController();
    warmRef.current = ctrl;
    const session = { active:true, paused:false, current:0, total:0, label:'Preparing…', bibleId };
    setDl(session);
    saveSession(session);
    await warmUpBible(bibleId, fetcher, (p) => {
      setDl((d)=>{
        const nd = { ...d, active:true, current: p.current, total: p.total, label: p.label };
        saveSession({ ...nd, bibleId });
        return nd;
      });
    }, ctrl);
    clearSession();
    setTimeout(() => setDl({ active: false, current: 0, total: 0, label: '', paused:false }), 1200);
  };
  const pauseDownload = () => {
    const c = warmRef.current; if (!c) return; c.pause(); setDl((d)=>{ const nd = { ...d, paused:true }; saveSession({ ...nd, bibleId }); return nd; });
  };
  const resumeDownload = () => {
    // If controller exists, just resume; else re-create and continue (will skip cached)
    const c = warmRef.current;
    if (c) { c.resume(); setDl((d)=>{ const nd = { ...d, paused:false }; saveSession({ ...nd, bibleId }); return nd; }); return; }
    // Recreate controller and continue
    (async () => {
      const ctrl = createWarmupController();
      warmRef.current = ctrl;
      setDl((d)=>{ const nd = { ...d, active:true, paused:false, label: d.label || 'Resuming…' }; saveSession({ ...nd, bibleId }); return nd; });
      await warmUpBible(bibleId, fetcher, (p) => {
        setDl((d)=>{ const nd = { ...d, current: p.current, total: p.total, label: p.label, active:true }; saveSession({ ...nd, bibleId }); return nd; });
      }, ctrl);
      clearSession();
      setDl({ active:false, current:0, total:0, label:'', paused:false });
    })();
  };
  const cancelDownload = () => {
    const c = warmRef.current; if (c) c.cancel(); clearSession(); setDl({ active:false, current:0, total:0, label:'', paused:false });
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
          {downloadedIds.length > 0 && (
            <>
              <p style={{ padding: '8px 12px', margin: 0, fontWeight: 600 }}>Downloaded</p>
              {bibleLists
                .filter((b)=> downloadedIds.includes(b.id))
                .filter((b)=>{
                  const q = (searchText || '').toLowerCase();
                  return !q || b.name.toLowerCase().includes(q) || b.language.name.toLowerCase().includes(q) || b.abbreviation.toLowerCase().includes(q)
                })
                .map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setBibleId(b.id);
                      setBAbr(b.abbreviation);
                      setGetBible(false);
                      addGHead("showBooks", true)
                      setLoading(false);
                    }}
                    className="bible_list"
                    style={{ borderLeft: '3px solid #0a7ea4' }}
                  >
                    {b.name} <span style={{fontSize:12, opacity:0.7}}>• offline</span>
                  </div>
                ))}
              <hr style={{ border:'none', borderTop:'1px solid #eee', margin:'8px 0' }} />
            </>
          )}
          {(() => {
            const q = (searchText || '').toLowerCase();
            const available = bibleLists
              .filter((b) =>
                b.name.toLowerCase().includes(q) ||
                b.language.name.toLowerCase().includes(q) ||
                b.abbreviation.toLowerCase().includes(q)
              )
              .filter((b) => !downloadedIds.includes(b.id));
            return (
              <>
                {available.length > 0 && (
                  <p style={{ padding: '8px 12px', margin: 0, fontWeight: 600 }}>Available</p>
                )}
                {available.map((b) => (
                  <div
                    key={b.id}
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
                ))}
              </>
            );
          })()}
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
                              addGHead("bible_ref", `${l.name || 'Mwanzo'} ${chp.number || '01'}`);
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
