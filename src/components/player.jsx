import { useEffect, useRef, useState } from "react";

function AudioPlayer({ sermonId, refCallback, src }) {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const audio = audioRef.current;
      refCallback(audio);
  
      const updateProgress = () => {
        if (audio && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
  
      audio.addEventListener("timeupdate", updateProgress);
      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
      };
    }, [refCallback]);
  
    return (
      <div className="player_cont">
        <audio ref={audioRef} src={src} loop/>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => {
            const val = (e.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = val;
            setProgress(e.target.value);
          }}
        />
      </div>
    );
  }

  export default AudioPlayer