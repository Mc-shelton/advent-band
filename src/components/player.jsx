import { useEffect, useRef, useState } from "react";

function AudioPlayer({ sermonId, refCallback, src }) {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      // Help first-play succeed: start muted, then unmute on first play
      audio.muted = true;
      const handleFirstPlay = () => { audio.muted = false; audio.removeEventListener('play', handleFirstPlay); };
      audio.addEventListener('play', handleFirstPlay);

      // Expose ref to parent
      refCallback(audio);

      const updateProgress = () => {
        if (audio && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.addEventListener("timeupdate", updateProgress);
      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener('play', handleFirstPlay);
      };
    }, [refCallback]);
  
    return (
      <div className="player_cont">
        <audio ref={audioRef} src={src} loop playsInline preload="auto" />
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
