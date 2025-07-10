import { pdfjs } from "react-pdf";
import "../../assets/styles/viewer.css";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import pdf from "../../assets/testData/test.pdf";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl, useGetApi } from "../../../bff/hooks";
import { ArrowBackOutlined, CloseFullscreenOutlined, CloseOutlined, ExpandOutlined, FitScreenOutlined, FullscreenOutlined, MinimizeOutlined, RotateLeftOutlined, ScreenRotationOutlined } from "@mui/icons-material";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function SliderControl({ min = 0.4, max = 3, step = 0.1, value, onChange }) {
  return (
    <div
      style={{
        height: "180px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "220px",
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
  const [loader, setLoader] = useState("start");
  const location = useLocation();
  const [controlsVisible, setControlsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const [scale, setScale] = useState(0.4);
  const { path,src, back } = location.state || {
    path: "/quarterlies/2023/Q1/2023-Q1.pdf",
  };
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(
    src
  );

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
  useEffect(()=>{
    // window.addEventListener("dblclick", (e)=>{
    //   e.preventDefault();
    //   setControlsVisible(true)});
  }, [])
  

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "2%",
      }}
    >
      <div
        className="lsn_back"
        onClick={() => {
          navigate("/"+ back );
        }}
      >
        <ArrowBackOutlined />
      </div>
      <div
        className="viewer_controls"
        style={{
          width:'80%',
          opacity: controlsVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
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
        <div style={{
          marginTop:'15px',
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 20%",
          alignItems: "center",
        }}>
          <FullscreenOutlined style={{
            fontSize: "25px",
          }}/>
          <CloseFullscreenOutlined style={{
            fontSize: "20px",
          }}/>
          <ScreenRotationOutlined style={{
            fontSize: "20px",
          }}/>
        </div>
        <SliderControl
          value={scale}
          onChange={(newScale) => {
            setScale(newScale)
          }}
        />
        <div className="zoomer" >
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
          <p className="zoomer_btn">{pageNumber} <span style={{fontSize:'12px'}}>of</span> {numPages}</p>
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
      <Document
        className="pdf-viewer"
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadProgress={({ loaded, total }) => {
          setLoader(`Loading progress: ${(loaded / total) * 100}%`);
          console.log(`Loading progress: ${(loaded / total) * 100}%`);
        }}
        loading="Loading my pdf..."
      >
        <Page
        onClick={()=>{
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
