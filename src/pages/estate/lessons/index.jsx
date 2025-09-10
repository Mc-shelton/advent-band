import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import testImage from "../../../assets/images/dailybread.jpg";
import "../../../assets/styles/lessons.css";
import { useGiraf } from "../../../giraf";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
import { createWarmupController, warmUpEstateLessons } from "@/estate/cache";
import LazyBg from "../../../components/LazyBg";

const LessonBooks = () => {
  const { gHead, addGHead } = useGiraf();
  const testList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const navigate = useNavigate();
  const { actionRequest } = useGetApi();
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { path, title, splash } = location.state || {};
  const [dl, setDl] = useState({ active:false, current:0, total:0, label:'', paused:false });
  const warmRef = useRef(null);
  const SESSION_KEY = 'estateLessonsDl';
  const saveSession = (s) => { try{ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }catch{} };
  const loadSession = () => { try{ const v = localStorage.getItem(SESSION_KEY); return v? JSON.parse(v): null; }catch{ return null; } };
  const clearSession = () => { try{ localStorage.removeItem(SESSION_KEY); }catch{} };

  useEffect(() => {
    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}estate/quarterlies/books`,
      params: {
        path,
      },
    })
      .then((res) => {
        console.log(res);
        setBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Resume download if session exists
  useEffect(() => {
    const sess = loadSession();
    if (sess?.active) setDl(sess);
  }, []);

  // Per-lesson save state
  const [saving, setSaving] = useState({}); // url => bool
  const [saved, setSaved] = useState({});   // url => bool
  useEffect(()=>{
    const m = {};
    (books||[]).forEach((t)=>{
      const u = getPdfUrl(t);
      if (u && localStorage.getItem(`lessonSaved:${u}`)==='1') m[u]=true;
    });
    setSaved(m);
  }, [books]);

  const getPdfUrl = (t) => {
    if (t?.src) return t.src;
    try{
      const q = parseInt(t.path.split('-')[1].split('/')[0],10).toString();
      const year = t.end_date.split('/')[2];
      const week = t.path.split('/')[4].padStart(2,'0');
      const year2 = String(year).slice(-2);
      return `https://www.adultbiblestudyguide.org/pdf.php?file=${year}:${q}Q:SE:PDFs:EAQ${q}${year2}_${week}.pdf`;
    }catch{ return undefined; }
  }

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
  }

  const saveLessonOffline = async (t) => {
    const u = getPdfUrl(t); if (!u) return;
    setSaving((s)=>({ ...s, [u]: true }));
    try{
      const ok = await cachePdf(u);
      if (ok){ localStorage.setItem(`lessonSaved:${u}`, '1'); setSaved((s)=>({ ...s, [u]: true })); }
    } finally {
      setSaving((s)=>({ ...s, [u]: false }));
    }
  }

  const startDownload = async () => {
    const ctrl = createWarmupController();
    warmRef.current = ctrl;
    const session = { active:true, paused:false, current:0, total:0, label:'Preparing lessons…' };
    setDl(session); saveSession(session);
    await warmUpEstateLessons(books, (p)=>{
      setDl((d)=>{ const nd = { ...d, ...p, active:true }; saveSession(nd); return nd; });
    }, ctrl);
    clearSession(); setDl({ active:false, current:0, total:0, label:'', paused:false });
  };
  const pauseDownload = () => { const c = warmRef.current; if (!c) return; c.pause(); setDl((d)=>{ const nd={...d, paused:true}; saveSession(nd); return nd; }); };
  const resumeDownload = () => {
    const c = warmRef.current; if (c) { c.resume(); setDl((d)=>{ const nd={...d, paused:false}; saveSession(nd); return nd; }); return; }
    // Recreate controller and continue
    startDownload();
  };
  const cancelDownload = () => { const c = warmRef.current; if (c) c.cancel(); clearSession(); setDl({ active:false, current:0, total:0, label:'', paused:false }); };
  return (
    <div className="lesson_books nav_page">
      {dl.active && (
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', padding: '8px 12px', borderBottom: '1px solid #eee', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#333' }}>{dl.label || 'Caching…'}</div>
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
      {!dl.active && books?.length > 0 && (
        <div style={{ padding: '8px 12px' }}>
          <button onClick={startDownload} style={{ fontSize:12, padding:'8px 12px', border:'1px solid #0a7ea4', borderRadius:6, background:'#fff', color:'#0a7ea4' }}>
            Download lessons for offline
          </button>
        </div>
      )}
      <div
        className="lsn_back"
        onClick={() => {
          navigate("/estate");
        }}
      >
        <ArrowBackOutlined />
      </div>

      <LazyBg className="lsn_book_splash" src={splash} />
      <p className="lsn_btt">
        {path?.split("/")[2]?.split("-").join(" - Q") || "Q-01"}
      </p>
      <p className="lsn_td">{title || "Title of Lesson"}</p>
      <div>
        {books.length > 0 ? (
          books.map((t, x) => {
            return (
              <div
                className="lsn_book"
                onClick={() => {
                  navigate("/viewer/pdf", {
                    state: {
                      something: "something",
                      back: "estate",
                      src:t.src,
                      path: `https://www.adultbiblestudyguide.org/pdf.php?file=${
                        t.end_date.split("/")[2]
                      }:${parseInt(
                        t.path.split("-")[1].split("/")[0]
                      ).toString()}Q:SE:PDFs:EAQ${parseInt(
                        t.path.split("-")[1].split("/")[0]
                      ).toString()}${t.end_date
                        .split("/")[2]
                        .slice(-2)}_${t.path
                        .split("/")[4]
                        .padStart(2, "0")}.pdf`,
                    },
                  });
                }}
              >
                <LazyBg className="lsn_book_spash" src={t.cover} />
                <div className="lsn_book_text">
                  <p className="lsn_b_tt">
                    {t.path.split("/")[4]}. {t.title}
                  </p>
                  <p className="lsn_b_dd">
                    {t.start_date} - {t.end_date}
                  </p>
                  <div style={{ marginTop: 6 }}>
                    <button
                      onClick={(e)=>{ e.stopPropagation(); saveLessonOffline(t); }}
                      disabled={!!saving[getPdfUrl(t)] || !!saved[getPdfUrl(t)]}
                      style={{ fontSize:12, padding:'6px 10px', border:'1px solid #0a7ea4', borderRadius:6, background:'#fff', color:'#0a7ea4' }}
                    >
                      {saved[getPdfUrl(t)] ? 'Offline ✓' : (saving[getPdfUrl(t)] ? 'Saving…' : 'Save offline')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>{loading ? <p>Loading...</p> : <p>No Lesson Available</p>}</div>
        )}
      </div>
    </div>
  );
};

export default LessonBooks;
