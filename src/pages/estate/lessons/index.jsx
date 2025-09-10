import { ArrowBack, ArrowBackOutlined } from "@mui/icons-material";
import testImage from "../../../assets/images/dailybread.jpg";
import "../../../assets/styles/lessons.css";
import { useGiraf } from "../../../giraf";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, useGetApi } from "../../../../bff/hooks";
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
