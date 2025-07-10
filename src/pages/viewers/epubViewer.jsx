import { useState } from "react";
import { ReactReader } from "react-reader";

const EpubReader = () => {
  const [location, setLocation] = useState(null);

  const handleRendition = (rendition) => {
    rendition.themes.default({
      '::selection': {
        background: 'yellow'  // optional: change selection highlight
      }
    });

    // Listen for text selection
    rendition.on("selected", (cfiRange, contents) => {
      rendition.annotations.highlight(cfiRange, {}, (e) => {
        console.log("highlight clicked", e.target);
      }, "hl", { fill: "yellow", "fill-opacity": "0.5", "mix-blend-mode": "multiply" });

      contents.window.getSelection().removeAllRanges(); // Clear selection
    });
  };

  return (
    <div style={{ height: "100vh" }}>
      <ReactReader
        url={"https://media2.egwwritings.org/epub/en_AA.epub"}
        location={location}
        onLocationChanged={(epubcfi) => setLocation(epubcfi)}
        getRendition={handleRendition}
      />
    </div>
  );
};

export default EpubReader;
