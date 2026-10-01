"use client";

import { useEffect, useState } from "react";

type Stage = "closed" | "opening" | "gone";

const WINDOW_OPEN_MS = 1450;

function FloralVine({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 220 360" aria-hidden="true">
      <path className="vine-stem" d="M18 350C22 270 82 270 60 202C42 146 104 126 102 62C101 35 121 17 151 8" />
      <path className="vine-stem vine-stem-thin" d="M59 204C103 217 129 197 142 166M102 65C69 74 55 56 45 35M43 279C79 291 102 274 114 249" />
      <g className="vine-leaves">
        <ellipse cx="28" cy="309" rx="11" ry="25" transform="rotate(-38 28 309)" />
        <ellipse cx="65" cy="273" rx="12" ry="27" transform="rotate(51 65 273)" />
        <ellipse cx="57" cy="220" rx="11" ry="25" transform="rotate(-43 57 220)" />
        <ellipse cx="111" cy="199" rx="10" ry="23" transform="rotate(48 111 199)" />
        <ellipse cx="74" cy="139" rx="11" ry="25" transform="rotate(-48 74 139)" />
        <ellipse cx="105" cy="91" rx="10" ry="23" transform="rotate(51 105 91)" />
        <ellipse cx="68" cy="59" rx="9" ry="21" transform="rotate(-57 68 59)" />
        <ellipse cx="132" cy="31" rx="10" ry="22" transform="rotate(46 132 31)" />
      </g>
      <g className="vine-flowers">
        <g transform="translate(58 194)"><circle r="15" /><circle cx="-13" cy="-3" r="12" /><circle cx="10" cy="-10" r="12" /><circle cx="8" cy="12" r="12" /><circle className="flower-heart" r="6" /></g>
        <g transform="translate(102 63) scale(.8)"><circle r="15" /><circle cx="-13" cy="-3" r="12" /><circle cx="10" cy="-10" r="12" /><circle cx="8" cy="12" r="12" /><circle className="flower-heart" r="6" /></g>
        <g transform="translate(43 279) scale(.65)"><circle r="15" /><circle cx="-13" cy="-3" r="12" /><circle cx="10" cy="-10" r="12" /><circle cx="8" cy="12" r="12" /><circle className="flower-heart" r="6" /></g>
        <g transform="translate(118 166) scale(.58)"><circle r="15" /><circle cx="-13" cy="-3" r="12" /><circle cx="10" cy="-10" r="12" /><circle cx="8" cy="12" r="12" /><circle className="flower-heart" r="6" /></g>
        <g transform="translate(80 128) scale(.48)"><circle r="15" /><circle cx="-13" cy="-3" r="12" /><circle cx="10" cy="-10" r="12" /><circle cx="8" cy="12" r="12" /><circle className="flower-heart" r="6" /></g>
        <g transform="translate(72 244) scale(.5)"><circle r="15" /><circle cx="-13" cy="-3" r="12" /><circle cx="10" cy="-10" r="12" /><circle cx="8" cy="12" r="12" /><circle className="flower-heart" r="6" /></g>
      </g>
    </svg>
  );
}

export function Intro() {
  const [stage, setStage] = useState<Stage>("closed");

  const openWindow = () => {
    if (stage !== "closed") return;
    window.dispatchEvent(new Event("wedding:open"));
    setStage("opening");
  };

  useEffect(() => {
    document.documentElement.classList.add("intro-active");
    return () => document.documentElement.classList.remove("intro-active");
  }, []);

  useEffect(() => {
    if (stage !== "opening") return;

    document.documentElement.classList.add("opened");
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove("intro-active");
      setStage("gone");
    }, WINDOW_OPEN_MS);

    return () => window.clearTimeout(timer);
  }, [stage]);

  if (stage === "gone") return null;

  return (
    <div className={`intro intro-${stage}`}>
      <button
        type="button"
        className="intro-window"
        onPointerDown={openWindow}
        onClick={(event) => {
          if (event.detail === 0) openWindow();
        }}
        aria-label="Open the window to reveal the wedding invitation"
        aria-disabled={stage !== "closed"}
      >
        <span className="window-shadow" aria-hidden="true" />
        <span className="window-frame" aria-hidden="true" />
        <span className="window-shutter window-shutter-left" aria-hidden="true">
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
        </span>
        <span className="window-shutter window-shutter-right" aria-hidden="true">
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
          <span className="window-panel" />
        </span>
        <span className="window-latch" aria-hidden="true" />
        <FloralVine className="window-vine window-vine-top-left" />
        <FloralVine className="window-vine window-vine-top-right" />
        <FloralVine className="window-vine window-vine-bottom-left" />
        <FloralVine className="window-vine window-vine-bottom-right" />
      </button>
      <p className="intro-hint">Open the window</p>
    </div>
  );
}
