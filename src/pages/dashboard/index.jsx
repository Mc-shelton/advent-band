import CButton from "../../components/buttton";
import "../../assets/styles/global.css";
import "../../assets/styles/dashboard.css";
import { useEffect, useRef, useState } from "react";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import AttractionsOutlinedIcon from "@mui/icons-material/AttractionsOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useGiraf } from "../../giraf";
import dailyBreadImage from "../../assets/images/dailybread.jpg";
import testImage from "../../assets/images/test.jpeg";
import {
  CloseOutlined,
  PauseCircleOutline,
  PauseCircleOutlineRounded,
  PlayArrowOutlined,
  PlayCircle,
  PlayCircleOutline,
  PlayCircleOutlineRounded,
  ShareOutlined,
} from "@mui/icons-material";
import { SearchOutlined, FilterListOutlined } from "@mui/icons-material";
import { getDate } from "../../../bff/lib/utils";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PdfViewer from "../viewers/pdfViewer";
import { baseUrl, useGetApi } from "../../../bff/hooks";
import AudioPlayer from "../../components/player";
import sermonsData from "../../assets/db/sermons.json";
// Defer loading sermons data to avoid blocking route load on mobile

const DashboardDefault = () => {
  const [m, setM] = useState("T");
  const { gHead, addGHead } = useGiraf();
  const [showDivotionalButts, setShowDivotionalButts] = useState(false);
  const [periodicals, setPeriodicals] = useState([]);
  const [prophecy, setProphecy] = useState();
  const [vop, setVop] = useState();
  const [playingId, setPlayingId] = useState("");
  const { actionRequest } = useGetApi();
  const devotionalRef = useRef();
  const [sermons, setSermons] = useState([]);
  const [sermonSearch, setSermonSearch] = useState("");
  const [speakerFilter, setSpeakerFilter] = useState("");
  const [showSpeakerList, setShowSpeakerList] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef(null);
  const playersRef = useRef({});

  const navigate = useNavigate();

  const handleMChange = (t) => {
    setM(t);
  };
  useEffect(() => {
    actionRequest({
      endPoint: `${baseUrl}periodicals`,
      cacheKey: "periodicals",
      strategy: "cache-first",
      cacheTtlMs: 10 * 60 * 1000,
      onUpdate: (res) => {
        const p1 = res.data.find((t) => t.type == "p1");
        const p2 = res.data.find((t) => t.type == "p2");
        const p3 = res.data.find((t) => t.type == "p3");
        setProphecy(p1);
        setPeriodicals(p2);
        setVop(p3);
      },
    }).then((res) => {
      const p1 = res.data.find((t) => t.type == "p1");
      const p2 = res.data.find((t) => t.type == "p2");
      const p3 = res.data.find((t) => t.type == "p3");
      setProphecy(p1);
      setPeriodicals(p2);
      setVop(p3);
    });
  }, []);

  // derive unique speakers for filter
  const speakers = Array.from(
    new Set((sermons || []).map((s) => s.speaker).filter(Boolean))
  );

  // filtered sermons
  const filteredSermons = (sermons || []).filter((sermon) => {
    const matchesText = sermonSearch
      ? (sermon.title || "")
          .toLowerCase()
          .includes(sermonSearch.toLowerCase()) ||
        (sermon.speaker || "")
          .toLowerCase()
          .includes(sermonSearch.toLowerCase())
      : true;
    const matchesSpeaker = speakerFilter
      ? sermon.speaker === speakerFilter
      : true;
    return matchesText && matchesSpeaker;
  });

  useEffect(() => {
    console.log(playingId);
    if (playingId && playersRef.current[playingId]) {
      playersRef.current[playingId]
        .play()
        .then(() => {
          playersRef.current[playingId].currentTime = getPlayHistory(playingId);
        })
        .catch((err) => {
          console.error("Autoplay failed:", err);
        });
    }
  }, [playingId]);

  // Lazy load sermons JSON after paint to avoid blocking initial render
  useEffect(() => {
    let active = true;
    const rif = (cb) =>
      window.requestIdleCallback
        ? window.requestIdleCallback(cb, { timeout: 1000 })
        : setTimeout(cb, 0);
    rif(() => {
      if (active) setSermons((sermonsData && sermonsData.default) || sermonsData || []);
    });
    return () => {
      active = false;
    };
  }, []);

  // Incrementally render more sermons when scrolled near the bottom
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((c) => Math.min(c + 6, sermons.length || c + 6));
          }
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sermons.length]);

  const handlePlay = (id) => {
    // Pause previous audio if another one is playing
    if (playingId && playingId !== id && playersRef.current[playingId]) {
      playersRef.current[playingId].pause();
      playersRef.current[playingId].currentTime = getPlayHistory(playingId);
    }

    setPlayingId(id); // trigger mounting of new <audio>
  };

  const handlePause = (id) => {
    console.log("handling puase ::: ");
    if (playersRef.current[id]) {
      playersRef.current[id].pause();
      savePlayHistory(id, playersRef.current[id].currentTime);
      // setPauseTime(pausedTime);
    }
    setPlayingId(null);
  };
  const savePlayHistory = (id, time) => {
    if (["mission", "vop"].includes(id)) {
      let today = new Date();
      // TODO : add an identity
      id = `${id}_${today.getFullYear()}_${
        today.getMonth() + 1
      }_${today.getDate()}`;
    }
    let hist = localStorage.getItem("playHistory");
    hist = hist ? JSON.parse(hist) : {};
    hist[id] = time;
    localStorage.setItem("playHistory", JSON.stringify(hist));
  };

  const getPlayHistory = (id) => {
    if (["mission", "vop"].includes(id)) {
      let today = new Date();
      // TODO : add an identity
      id = `${id}_${today.getFullYear()}_${
        today.getMonth() + 1
      }_${today.getDate()}`;
    }
    let hist = localStorage.getItem("playHistory");
    hist = hist ? JSON.parse(hist) : {};
    let time = hist[id] || 0;
    time = time > 3 ? time - 3 : 0;
    return time;
  };

  return (
    <div className="Home nav_page">
      <div className="p_header">
        <p
          className={`${m == "T" ? "focus" : ""}`}
          onClick={() => handleMChange("T")}
        >
          Today
        </p>
        <p
          className={`${m == "C" ? "focus" : ""}`}
          onClick={() => {
            handleMChange("C");
            navigate("/community");
          }}
        >
          Community
        </p>
        <div className="h_icons">
          <div className="h_ic">
            <BoltIcon className="h_ic_" />
            {/* <p style={{
              fontSize:'12px'
            }}>2</p> */}
          </div>
          <div className="h_ic">
            <NotificationsNoneOutlinedIcon className="h_ic_" />
            {gHead.notifications > 0 && (
              <p>
                {/* {(() => {
                let keys = Object.keys(localStorage);
                let unreadMessages = keys.map((k) => {
                  console.log(k);
                  let v = localStorage.getItem(k);
                  try{
                  v = v ? JSON.parse(v) : [];
                  }catch(e){
                    v = [];
                  }
                  if (v[0]?.group) {
                    let unread = v.filter((i) => i.status != "read" && i.user_id == gHead?.user?.id).length;
                    return unread;
                  } else {
                    return 0;
                  }
                });
                // find total of unread messages
                return unreadMessages.reduce((a, b) => a + b, 0);
              })()} */}
                {gHead.notifications || 0}
              </p>
            )}
          </div>
        </div>
        <div style={{
          // border:'2px solid red',
          marginRight:'10px'
        }}>
          <CButton
            text={
              gHead.user
                ? gHead.user.name
                  ? gHead.user.name[0]
                  : gHead.user.email[0]
                : "Sign In"
            }
            onClick={() => {
              addGHead("login", true);
            }}
            style={{
              marginLeft: "15%",
              fontWeight: gHead.user ? "700" : "400",
              fontSize: "12px",
              paddingLeft: "18px",
              paddingRight: "18px",
              textWrap: "nowrap",
              width: "100%",
            }}
          />
        </div>
      </div>
      <div className="dashboard_page">
        <div className="header">
          <div className="header_side">
            <div className="liner">
              <div
                className="l_c"
                style={{
                  marginTop: "100px",
                  backgroundColor: "rgb(105, 148, 181)",
                  border: `2px solid  rgb(105, 148, 181)`,
                }}
              ></div>
              <div
                className="l_h"
                style={{
                  height: "165px",
                }}
              ></div>
            </div>
            <div className="liner">
              <div className="l_c"></div>
              <div
                className="l_h"
                style={{
                  height: "100px",
                }}
              ></div>
            </div>
            <div className="liner">
              <div className="l_c"></div>
            </div>
          </div>

          <div className="header_main">
            <p className="m_header">Daily Refresh</p>
            <div
              className="hs_1"
              ref={devotionalRef}
              style={{
                backgroundImage: showDivotionalButts
                  ? ` linear-gradient(to top,rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 90%, transparent),url(${testImage})`
                  : ` linear-gradient(to top,rgba(0, 0, 0, 0.96) 0%, rgba(0, 0, 0, 0.5) 50%, transparent),url(${testImage})`,
              }}
            >
              <div className="hs_container">
                <p className="hs_p1">Did You Know?</p>
                <p
                  className="hs_p2"
                  style={{
                    // lineHeight:'25px',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textWrap: "nowrap",
                  }}
                >
                  {prophecy?.title}
                </p>
                <p
                  className="hs_p3"
                  style={{
                    height: showDivotionalButts && "75%",
                    overflow: showDivotionalButts && "scroll",
                  }}
                  onClick={() => {
                    devotionalRef.current.style.position = "absolute";
                    devotionalRef.current.style.top = "0";
                    devotionalRef.current.style.left = "0";
                    devotionalRef.current.style.borderRadius = "0px";
                    devotionalRef.current.style.height = "100%";
                    devotionalRef.current.style.width = "100%";
                    devotionalRef.current.style.marginTop = "0";
                    devotionalRef.current.style.zIndex = "100005";
                    setShowDivotionalButts(true);
                  }}
                  dangerouslySetInnerHTML={{ __html: prophecy?.content }}
                ></p>
                {!showDivotionalButts && (
                  <div
                    className="hs_b_holder"
                    style={{
                      fontSize: "12px",
                      marginTop: "20px",
                    }}
                  >
                    <ClockCircleOutlined
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    {prophecy?.avTime} - {getDate(new Date(prophecy?.forDate))}
                  </div>
                )}
                {showDivotionalButts && (
                  <div className="hs_b_holder hs_full">
                    <CloseOutlined
                      onClick={() => {
                        devotionalRef.current.style.position = "relative";
                        devotionalRef.current.style.borderRadius = "15px";
                        devotionalRef.current.style.height = "250px";
                        devotionalRef.current.style.zIndex = "10";

                        setShowDivotionalButts(false);
                      }}
                    />
                    {/* <ShareOutlined /> */}
                  </div>
                )}
              </div>
            </div>
            <div
              className="hs_2"
              style={{
                height: playingId == "mission" && "fit-content",
              }}
            >
              <div className="hs_2_holder">
                <div className="hs_2_left">
                  <p className="hs_2_p1">Mission Devotional</p>
                  <br />
                  <p className="hs_2_p2">
                    {getDate(new Date(periodicals?.forDate))} :{" "}
                    {periodicals?.title}
                  </p>
                  <p className="hs_2_p3">
                    <ClockCircleOutlined /> {periodicals?.avTime}
                  </p>
                </div>
                <div
                  className="hs_2_right"
                  style={{
                    backgroundImage: `url(${
                      periodicals?.thumb_nails || dailyBreadImage
                    })`,
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    playingId == "mission"
                      ? handlePause("mission")
                      : handlePlay("mission");
                  }}
                >
                  <div className="d_av_overlay">
                    {playingId == "mission" ? (
                      <PauseCircleOutlineRounded className="play_butt" />
                    ) : (
                      <PlayCircleOutlineRounded className="play_butt" />
                    )}
                  </div>
                </div>
              </div>
              {playingId == "mission" && (
                <AudioPlayer
                  sermonId={"mission"}
                  refCallback={(el) => {
                    playersRef.current["mission"] = el;
                    // Auto-play when the ref becomes available (first mount)
                    if (el && playingId === "mission") {
                      try {
                        el.play();
                      } catch {}
                    }
                  }}
                  src={
                    periodicals?.url ||
                    "https://adventband.org/bucket/sermons/a_major.mp3"
                  }
                />
              )}
            </div>
            <div
              className="hs_2"
              style={{
                // height: playingId == "vop" && "fit-content",
                height: "fit-content",
              }}
            >
              <div className="hs_2_holder" style={{}}>
                <div className="hs_2_left">
                  <p className="hs_2_p1">Voice Of Prophecy</p>
                  <br />
                  <p className="hs_2_p2">
                    {" "}
                    {getDate(new Date(vop?.forDate))} : {vop?.title}
                  </p>
                  <p className="hs_2_p3">
                    <ClockCircleOutlined /> {vop?.avTime}
                  </p>
                </div>
                <div
                  className="hs_2_right"
                  style={{
                    backgroundImage: `url(${
                      vop?.thumb_nails || dailyBreadImage
                    })`,
                  }}
                  onClick={() => {
                    playingId == "vop" ? handlePause("vop") : handlePlay("vop");
                  }}
                >
                  <div className="d_av_overlay">
                    {playingId == "vop" ? (
                      <PauseCircleOutlineRounded className="play_butt" />
                    ) : (
                      <PlayCircleOutlineRounded className="play_butt" />
                    )}
                  </div>
                </div>
              </div>
              {playingId == "vop" && (
                <AudioPlayer
                  sermonId={"vop"}
                  refCallback={(el) => {
                    playersRef.current["vop"] = el;
                    if (el && playingId === "vop") {
                      try {
                        el.play();
                      } catch {}
                    }
                  }}
                  src={
                    vop?.url ||
                    "https://adventband.org/bucket/sermons/a_major.mp3"
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div className="d_content">
          <p className="dc_p1">Sermons</p>

          {/* Sermon search + speaker filter */}
          <div style={{ padding: "0 0 8px 0" }}>
            <div
              className="search"
              style={{
                width: "100%",
                maxWidth: "680px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent:'flex-start'
              }}
            >
              {/* Speaker filter trigger (left) */}
              <div
                onClick={() => setShowSpeakerList((v) => !v)}
                title="Filter by speaker"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: "0 8px",
                  cursor: "pointer",
                  marginRight:'5%'
                }}
              >
                <FilterListOutlined />
              </div>
              <SearchOutlined />
              <input
                className="s_i"
                placeholder="Search sermons (title or speaker)..."
                value={sermonSearch}
                onChange={(e) => setSermonSearch(e.target.value)}
                aria-label="Search sermons"
                style={{
                  background: "transparent",
                  width:'80%'
                }}
              />
              {/* Simple flyout list */}
              {showSpeakerList && (
                <div
                  style={{
                    position: "absolute",
                    left: 6,
                    top: "110%",
                    background:'#fff',
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    padding: 8,
                    zIndex: 1000,
                    minWidth: 220,
                    maxHeight: 220,
                    overflow: "auto",
                  }}
                >
                  <div
                    onClick={() => {
                      setSpeakerFilter("");
                      setShowSpeakerList(false);
                    }}
                    style={{
                      padding: "6px 8px",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: speakerFilter === "" ? 700 : 500,
                    }}
                  >
                    All speakers
                  </div>
                  {speakers.map((sp) => (
                    <div
                      key={sp}
                      onClick={() => {
                        setSpeakerFilter(sp);
                        setShowSpeakerList(false);
                      }}
                      style={{
                        padding: "6px 8px",
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: speakerFilter === sp ? 700 : 500,
                      }}
                    >
                      {sp}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredSermons.slice(0, visibleCount).map((sermon, x) => {
            const isPlaying = playingId === sermon.id;
            let testAudios = [
              "https://adventband.org/bucket/sermons/test_audio.mp3",
              "https://adventband.org/bucket/sermons/a_major.mp3",
              "https://adventband.org/bucket/sermons/a_major.mp3",
            ];
            sermon.url = testAudios[sermon.id];
            return (
              <div className="d_holder" key={x}>
                <div className="d_holder_cont">
                  <div
                    className="d_av"
                    onClick={() => {
                      isPlaying
                        ? handlePause(sermon.id)
                        : handlePlay(sermon.id);
                    }}
                    style={{
                      backgroundImage: `url(${dailyBreadImage})`,
                    }}
                  >
                    <div className="d_av_overlay">
                      {isPlaying ? (
                        <PauseCircleOutlineRounded className="play_butt" />
                      ) : (
                        <PlayCircleOutlineRounded className="play_butt" />
                      )}
                    </div>
                  </div>
                  <div className="d_cont">
                    <p className="hs_2_p1">{sermon.speaker}</p>
                    <br />
                    <p className="hs_2_p2">{sermon.title}</p>
                    <p className="hs_2_p3">
                      <ClockCircleOutlined /> {sermon.avTime}
                    </p>
                  </div>
                </div>
                {isPlaying && (
                  <AudioPlayer
                    sermonId={sermon.id}
                    refCallback={(el) => {
                      playersRef.current[sermon.id] = el;
                      if (el && playingId === sermon.id) {
                        try {
                          el.play();
                        } catch {}
                      }
                    }}
                    src={sermon.link}
                  />
                )}
              </div>
            );
          })}
          {/* Sentinel for lazy-loading more sermons */}
          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
};

export default DashboardDefault;
