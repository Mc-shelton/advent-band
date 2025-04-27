import { pdfjs } from "react-pdf";
import "../../assets/styles/viewer.css";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import pdf from "../../assets/testData/test.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      alert('resized')
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLandscape;
}

function PdfViewer() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [loader, setLoader] = useState("start");
  const isLandscape = useIsLandscape();
  useEffect(() => {
    const handleResize = () => {
    //   setIsLandscape(window.innerWidth > window.innerHeight);
      alert('resized')
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer" style={{}}>
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadProgress={({ loaded, total }) => {
          setLoader(`Loading progress: ${(loaded / total) * 100}%`);
          console.log(`Loading progress: ${(loaded / total) * 100}%`);
        }}
        loading="Loading my pdf..."
      >
        {Array.from(new Array(numPages), (el, index) => (
          <button
            key={`page_${index + 1}`}
            onClick={() => setPageNumber(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          //   scale={.8}
          width={900}
          height={500}
          rotate={isLandscape ? 90 : 0}
          // className="pdf-page"
          orientation="landscape"
        />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <p>{loader}</p>
    </div>
  );
}

export default PdfViewer;
