import { pdfjs } from "react-pdf";
import "../../assets/styles/viewer.css";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import pdf from "../../assets/testData/test.pdf";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl, useGetApi } from "../../../bff/hooks";
import {
  ArrowBackOutlined,
  CloseFullscreenOutlined,
  CloseOutlined,
  ExpandOutlined,
  FitScreenOutlined,
  FullscreenOutlined,
  MinimizeOutlined,
  RotateLeftOutlined,
  ScreenRotationOutlined,
} from "@mui/icons-material";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function SliderControl({ min = 0.4, max = 3, step = 0.1, value, onChange }) {
  return (
    <div
      style={{
        // height: "180px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "30px",
        margin: "0",
      }}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        className="slider_input"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
function PdfViewer() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [loaderPct, setLoaderPct] = useState(0);
  const location = useLocation();
  const [controlsVisible, setControlsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const [scale, setScale] = useState(0.4);
  const { path, src, back } = location.state || {
    path: "/quarterlies/2023/Q1/2023-Q1.pdf",
  };
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(src);
  const [cached, setCached] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { actionRequest } = useGetApi();
  // console.log('',path)
  const resetHideControlsTimer = () => {
    setControlsVisible(true); // Show controls on interaction
    if (timeoutId) clearTimeout(timeoutId);

    const id = setTimeout(() => {
      setControlsVisible(false);
    }, 4000); // hide after 2 seconds of inactivity

    setTimeoutId(id);
  };
  useEffect(() => {
    // window.addEventListener("dblclick", (e)=>{
    //   e.preventDefault();
    //   setControlsVisible(true)});
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const navigate = useNavigate();
  // PDF cache helpers
  const PDF_CACHE = "pdf-v1";
  const isCached = async (url) => {
    try {
      const cache = await caches.open(PDF_CACHE);
      const req = new Request(url, { mode: "cors" });
      const match = await cache.match(req);
      return !!match;
    } catch {
      return false;
    }
  };
  const cachePdf = async (url) => {
    try {
      setDownloading(true);
      const cache = await caches.open(PDF_CACHE);
      const req = new Request(url, { mode: "cors" });
      const match = await cache.match(req);
      if (match) {
        setCached(true);
        setDownloading(false);
        return;
      }
      const resp = await fetch(req);
      if (resp && resp.ok) await cache.put(req, resp.clone());
      setCached(true);
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!pdf) return;
    isCached(pdf).then(setCached);
  }, [pdf]);
  return (
    <div
      style={{
        padding: "2%",
      }}
    >
      <div
        className="lsn_back"
        onClick={() => {
          navigate("/" + back);
        }}
      >
        <ArrowBackOutlined />
      </div>
      <div
        className="viewer_controls"
        style={{
          width: "80%",
          opacity: controlsVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          // border: "2px solid red",
          position: "absolute",
          bottom: "20%",
          display: "block",
          pointerEvents: controlsVisible ? "auto" : "none", // prevent ghost clicks
        }}
      >
        {/* <p 
        onClick={()=>{
          setControlsVisible(false);
          // alert()
        }}>
          <CloseOutlined style={{
          fontSize: "15px",
          textAlign:'left',
          marginLeft:'90%'
        }}
        />
        </p> */}

        <SliderControl
          value={scale}
          onChange={(newScale) => {
            setScale(newScale);
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FullscreenOutlined
              style={{
                fontSize: "25px",
              }}
            />
            <CloseFullscreenOutlined
              style={{
                fontSize: "20px",
              }}
            />
            <ScreenRotationOutlined
              style={{
                fontSize: "20px",
              }}
            />
          </div>
          <div
            className="zoomer_"
            style={{
              display: "flex",
              gap: "10px",
              marginLeft: "10%",
            }}
          >
            <p
              className="zoomer_btn"
              onClick={() => {
                setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
              }}
            >
              <LeftOutlined
                style={{
                  fontSize: "12px",
                }}
              />
            </p>
            <p className="zoomer_btn">
              {pageNumber} <span style={{ fontSize: "12px" }}>of</span>{" "}
              {numPages}
            </p>
            <p
              className="zoomer_btn"
              onClick={() => {
                setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
              }}
            >
              <RightOutlined
                style={{
                  fontSize: "12px",
                }}
              />
            </p>
          </div>
        </div>
        {/* <button
            onClick={() => cachePdf(pdf)}
            disabled={!pdf || downloading || cached}
            style={{ fontSize:12, padding:'6px 10px', border:'1px solid #0a7ea4', borderRadius:6, background:'#fff', color:'#0a7ea4' }}
          >
            {cached ? 'Available offline ✓' : (downloading ? 'Saving…' : 'Save offline')}
          </button> */}
      </div>
      <Document
        className="pdf-viewer"
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadProgress={({ loaded, total }) => {
          const pct = total ? Math.floor((loaded / total) * 100) : 0;
          setLoaderPct(pct);
        }}
        loading={<div style={{ padding: 12, fontSize: 12, color: '#333' }}>Loading {loaderPct}%</div>}
      >
        <Page
          onClick={() => {
            setControlsVisible((prev) => !prev);
          }}
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={scale}
          width={900}
          height={500}
        />
      </Document>
    </div>
  );
}

export default PdfViewer;
