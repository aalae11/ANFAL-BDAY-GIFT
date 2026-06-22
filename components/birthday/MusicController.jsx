"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import styles from "./BirthdayExperience.module.css";

export default function MusicController({ started }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const tryPlayMusic = useCallback(async () => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.55;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setPlayBlocked(false);
    } catch {
      setIsPlaying(false);
      setPlayBlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (!started) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPlayBlocked(false);
      return;
    }
    tryPlayMusic();
  }, [started, tryPlayMusic]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  function handleMusicButtonClick() {
    if (!audioRef.current) return;

    if (playBlocked || !isPlaying || audioRef.current.paused) {
      audioRef.current.muted = false;
      setMuted(false);
      tryPlayMusic();
      return;
    }

    setMuted((value) => !value);
  }

  const buttonLabel = playBlocked || !isPlaying ? "Play music" : muted ? "Unmute" : "Mute";

  return (
    <div className={styles.musicControl}>
      <audio
        ref={audioRef}
        src={birthdayConfig.musicPath}
        loop
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setIsPlaying(true);
          setPlayBlocked(false);
        }}
        preload="auto"
      />
      {started && (
        <button type="button" onClick={handleMusicButtonClick} aria-label={buttonLabel}>
          {buttonLabel}
        </button>
      )}
      {playBlocked && <span>Music needs one more tap.</span>}
    </div>
  );
}
