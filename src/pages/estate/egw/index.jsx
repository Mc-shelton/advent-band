import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import testImage from "../../../assets/images/dailybread.jpg";
import "../../../assets/styles/lessons.css";
import { useGiraf } from "../../../giraf";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
import egwLogo from "../../../assets/images/egw_logo.png";

const FolderBooks = () => {
  const { gHead, addGHead } = useGiraf();
  const testList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const navigate = useNavigate();
  const { actionRequest } = useGetApi();
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { url, title, splash } = location.state || {};

  useEffect(() => {
    setLoading(true);
    actionRequest({
      endPoint: `${baseUrl}estate/egw/folder`,
      params: {
        url,
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

  return (
    <div className="lesson_books nav_page">
      <div
        className="lsn_back"
        onClick={() => {
          navigate("/estate");
        }}
      >
        <ArrowBackOutlined />
      </div>

      <div
        className="lsn_book_splash"
        style={{
          backgroundImage: `url(${egwLogo})`,
        }}
      ></div>
      <p className="lsn_btt">{title || "Title of Folder"}</p>
      <p className="lsn_td">
        {books.length} {title || "Title of Folder"}
      </p>
      <div>
        {books.length > 0 ? (
          books.map((t, x) => {
            return (
              <div
                className="lsn_book"
                onClick={() => {
                  navigate("/viewer/egw", {
                    state: {
                      id_pub: t.url,
                      maxpuborder: t.maxpuborder,
                      splash,
                      title,
                      url
                    },
                  });
                }}
              >
                <div
                  className="lsn_book_spash"
                  style={{
                    backgroundImage: `url(https://media2.egwwritings.org/covers/${t.pubnr}_s.jpg)`,
                  }}
                ></div>
                <div className="lsn_book_text">
                  <p className="lsn_b_tt">{t.title}</p>
                  <p
                    className="lsn_b_dd"
                    style={{
                      padding: "0",
                    }}
                  >
                    No. - {t.pubnr}
                  </p>
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

export default FolderBooks;
