"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const fmt = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ pos: 0, dur: 0 });

  const play = useCallback(() => {
    void audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setTime((current) => ({ ...current, pos: 0 }));
    void audio.play();
  }, []);

  useEffect(() => {
    const playFromStart = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      void audio.play();
    };

    window.addEventListener("wedding:open", playFromStart);
    return () => window.removeEventListener("wedding:open", playFromStart);
  }, []);

  const pct = time.dur ? Math.min(100, (time.pos / time.dur) * 100) : 0;

  const playPauseIcon = playing ? (
    <svg viewBox="0 0 24 24" aria-hidden><path d="M8 6h3v12H8zM13 6h3v12h-3z" className="fill" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden><path d="M9 6.5v11l9-5.5z" className="fill" /></svg>
  );

  return (
    <div className={`player ${playing ? "is-playing" : ""}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          setTime({ pos: 0, dur: audio.duration });
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setTime({ pos: audio.currentTime, dur: audio.duration });
        }}
      />
      <p className="player-title">{playing ? "Our song is playing" : "Press play to hear our song"}</p>
      <div className="player-eq" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * -0.23}s` }} />
        ))}
      </div>
      <div className="player-bar">
        <span className="player-time">{fmt(time.pos)}</span>
        <div className="player-track">
          <div className="player-fill" style={{ width: `${pct}%` }} />
          <div className="player-knob" style={{ left: `${pct}%` }} />
        </div>
        <span className="player-time">{fmt(time.dur)}</span>
      </div>
      <div className="player-controls">
        <button type="button" aria-label="Restart song" onClick={restart}>
          <svg viewBox="0 0 24 24"><path d="M18 5 8 12l10 7zM5 5h2v14H5z" className="fill" /></svg>
        </button>
        <button
          type="button"
          className="pc-main"
          aria-label={playing ? "Pause" : "Play"}
          onClick={playing ? pause : play}
        >
          {playPauseIcon}
        </button>
      </div>
    </div>
  );
}
