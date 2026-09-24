"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* A gentle music-box arpeggio (Pachelbel-style progression) synthesised with
   Web Audio. Used whenever the real song file can't be played. */
class MusicBox {
  static beat = 60 / 76 / 2; // eighth notes at 76 bpm
  // [root midi, third interval]
  static chords: [number, number][] = [
    [50, 4], [45, 4], [47, 3], [42, 3], [43, 4], [38, 4], [43, 4], [45, 4],
  ];
  static pattern = [0, 7, 12, "t", 19, "t", 12, 7] as const;
  static loopLength = MusicBox.chords.length * 8 * MusicBox.beat;

  ctx: AudioContext;
  out: GainNode;
  step = 0;
  nextTime = 0;
  startedAt = 0;
  timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.ctx = new AudioContext();
    this.out = this.ctx.createGain();
    this.out.gain.value = 0.18;
    this.out.connect(this.ctx.destination);
  }

  note(midi: number, when: number, vol = 1) {
    const freq = 440 * 2 ** ((midi - 69) / 12);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.5 * vol, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
    g.connect(this.out);
    for (const [mult, type, amp] of [[1, "sine", 1], [2, "triangle", 0.18], [4.01, "sine", 0.06]] as const) {
      const o = this.ctx.createOscillator();
      const og = this.ctx.createGain();
      o.type = type;
      o.frequency.value = freq * mult;
      og.gain.value = amp;
      o.connect(og).connect(g);
      o.start(when);
      o.stop(when + 1.9);
    }
  }

  schedule = () => {
    while (this.nextTime < this.ctx.currentTime + 0.25) {
      const [root, third] = MusicBox.chords[Math.floor(this.step / 8) % MusicBox.chords.length];
      const p = MusicBox.pattern[this.step % 8];
      const offset = p === "t" ? 12 + third : p;
      this.note(root + offset, this.nextTime, this.step % 8 === 0 ? 0.9 : 0.55);
      if (this.step % 8 === 0) this.note(root + 24 + third, this.nextTime + MusicBox.beat * 2, 0.35);
      this.nextTime += MusicBox.beat;
      this.step++;
    }
  };

  play() {
    this.ctx.resume();
    this.nextTime = this.ctx.currentTime + 0.05;
    this.startedAt = this.ctx.currentTime - this.step * MusicBox.beat;
    this.timer = setInterval(this.schedule, 80);
    this.schedule();
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.ctx.suspend();
  }

  restart() {
    this.step = 0;
    this.startedAt = this.ctx.currentTime;
    this.nextTime = this.ctx.currentTime + 0.05;
  }

  get position() {
    return (this.step * MusicBox.beat) % MusicBox.loopLength;
  }
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const boxRef = useRef<MusicBox | null>(null);
  const useSynth = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ pos: 0, dur: MusicBox.loopLength });
  const [loop, setLoop] = useState(true);

  const startSynth = useCallback(() => {
    useSynth.current = true;
    boxRef.current ??= new MusicBox();
    boxRef.current.play();
    setPlaying(true);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (useSynth.current || !audio) return startSynth();
    audio.play().then(() => setPlaying(true), startSynth);
  }, [startSynth]);

  const pause = useCallback(() => {
    if (useSynth.current) boxRef.current?.pause();
    else audioRef.current?.pause();
    setPlaying(false);
  }, []);

  // Start music when the intro envelope is opened.
  useEffect(() => {
    const onOpen = () => play();
    window.addEventListener("wedding:open", onOpen);
    return () => window.removeEventListener("wedding:open", onOpen);
  }, [play]);

  // Progress for the synth fallback.
  useEffect(() => {
    if (!playing || !useSynth.current) return;
    const id = setInterval(() => {
      if (boxRef.current) setTime({ pos: boxRef.current.position, dur: MusicBox.loopLength });
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => () => boxRef.current?.pause(), []);

  const restart = () => {
    if (useSynth.current) boxRef.current?.restart();
    else if (audioRef.current) audioRef.current.currentTime = 0;
    setTime((t) => ({ ...t, pos: 0 }));
  };

  const pct = time.dur ? Math.min(100, (time.pos / time.dur) * 100) : 0;

  return (
    <div className={`player ${playing ? "is-playing" : ""}`}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        loop={loop}
        onError={() => (useSynth.current = true)}
        onTimeUpdate={(e) => setTime({ pos: e.currentTarget.currentTime, dur: e.currentTarget.duration || 1 })}
        onEnded={() => setPlaying(false)}
      />
      <p className="player-title">Press play to hear our song</p>
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
        <button type="button" aria-label="Shuffle" className="pc-small" onClick={restart}>
          <svg viewBox="0 0 24 24"><path d="M3 7h3c5 0 7 10 12 10h3M3 17h3c2 0 3.2-1.5 4.3-3.3M14 8.5C15 7.5 16.3 7 18 7h3M18 4l3 3-3 3M18 14l3 3-3 3" /></svg>
        </button>
        <button type="button" aria-label="Previous" onClick={restart}>
          <svg viewBox="0 0 24 24"><path d="M18 5 8 12l10 7zM5 5h2v14H5z" className="fill" /></svg>
        </button>
        <button
          type="button"
          className="pc-main"
          aria-label={playing ? "Pause" : "Play"}
          onClick={playing ? pause : play}
        >
          {playing ? (
            <svg viewBox="0 0 24 24"><path d="M8 6h3v12H8zM13 6h3v12h-3z" className="fill" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M9 6.5v11l9-5.5z" className="fill" /></svg>
          )}
        </button>
        <button type="button" aria-label="Next" onClick={restart}>
          <svg viewBox="0 0 24 24"><path d="m6 5 10 7-10 7zM17 5h2v14h-2z" className="fill" /></svg>
        </button>
        <button
          type="button"
          aria-label="Repeat"
          aria-pressed={loop}
          className={`pc-small ${loop ? "is-on" : ""}`}
          onClick={() => setLoop((l) => !l)}
        >
          <svg viewBox="0 0 24 24"><path d="M4 11V9a3 3 0 0 1 3-3h13M17 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H4M7 21l-3-3 3-3" /></svg>
        </button>
      </div>
    </div>
  );
}
