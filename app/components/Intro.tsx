"use client";

import { useEffect, useState } from "react";
import { WaxSeal } from "./decor";

type Stage = "closed" | "opening" | "gone";

const OPEN_MS = 1450;

export function Intro({ monogram }: { monogram: string }) {
  const [stage, setStage] = useState<Stage>("closed");

  const openInvitation = () => {
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
    }, OPEN_MS);

    return () => window.clearTimeout(timer);
  }, [stage]);

  if (stage === "gone") return null;

  return (
    <div className={`intro intro-${stage}`}>
      <button
        type="button"
        className="intro-window burgundy-opening"
        onPointerDown={openInvitation}
        onClick={(event) => {
          if (event.detail === 0) openInvitation();
        }}
        aria-label="Open the wedding invitation"
        aria-disabled={stage !== "closed"}
      >
        <span className="window-shutter window-shutter-left" aria-hidden="true">
          <span className="burgundy-inner-border" />
          <span className="burgundy-corner burgundy-corner-top" />
          <span className="burgundy-corner burgundy-corner-bottom" />
        </span>
        <span className="window-shutter window-shutter-right" aria-hidden="true">
          <span className="burgundy-inner-border" />
          <span className="burgundy-corner burgundy-corner-top" />
          <span className="burgundy-corner burgundy-corner-bottom" />
        </span>
        <span className="opening-copy" aria-hidden="true">
          <span className="opening-kicker">Together with their families</span>
          <span className="opening-title">Jashna</span>
          <span className="opening-rule" />
          <WaxSeal monogram={monogram} className="opening-seal" />
        </span>
      </button>
      <p className="intro-hint">Tap to open</p>
    </div>
  );
}
