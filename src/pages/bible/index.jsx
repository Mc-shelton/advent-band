import CButton from "../../components/buttton";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import "../../assets/styles/hymn.css";
import "../../assets/styles/bible.css";
import data from "../../assets/db/n_eng_db.json";
import { AddHome, SearchOutlined, TurnedIn } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useGiraf } from "../../giraf";
import useAxios from "../../hooks/useAxios";
import { LoadingOutlined } from "@ant-design/icons";
const Bible = () => {
  const [searchText, setSearchText] = useState(null);
  const { gHead, addGHead } = useGiraf();
  const [song, setSong] = useState(data[0]);
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

  useEffect(() => {
    setLoading(true);
    setBooks([]);
    get(`bibles/${bibleId}/books`)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("An error occured");
      });
  }, [bibleId]);


  const getBibles = () => {
    if (bibleLists.length > 0) {
      setBookIndex((t) => "90");
      setSearchText((t) => "");
      return
    }
    setLoading(true);
    get(`bibles`)
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
    get(`bibles/${bibleId}/books/${id}/chapters`)
      .then((res) => {
        setChapters(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("An error occured");
      });
  };

  const getVerses = (id, book, chapter) => {
    get(`bibles/${bibleId}/passages/${id}`)
      .then((res) => {
        setPassage(res.data.content);
        setLoading(false);
        addGHead("bsearch", false);
      })
      .catch((err) => {
        console.log("An error occured");
      });
  };
  return (
    <div className="bible nav_page">
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
                              addGHead("s_n", `${l.name} ${chp.number}`);
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
