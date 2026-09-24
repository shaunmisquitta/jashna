"use client";

import { useEffect, useState } from "react";
import { WaxSeal } from "./decor";

type Stage = "closed" | "opening" | "open" | "leaving" | "gone";

// Full-screen closed envelope. Tapping the seal opens it, then reveals the invitation.
export function Intro({ bride, groom, monogram }: { bride: string; groom: string; monogram: string }) {
  const [stage, setStage] = useState<Stage>("closed");

  useEffect(() => {
    if (stage === "closed") return;
    const next: Partial<Record<Stage, [Stage, number]>> = {
      opening: ["open", 750],
      open: ["leaving", 1500],
      leaving: ["gone", 900],
    };
    const step = next[stage];
    if (!step) return;
    if (stage === "leaving") document.documentElement.classList.add("opened");
    const t = setTimeout(() => setStage(step[0]), step[1]);
    return () => clearTimeout(t);
  }, [stage]);

  if (stage === "gone") return null;

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
  };

  return (
    <div className={`intro intro-${stage}`}>
      <p className="intro-names">
        {bride} <span>&amp;</span> {groom}
      </p>
      <button type="button" className="intro-env" onClick={open} aria-label="Open invitation">
        <span className="ie-back" />
        <span className="ie-letter">
          <span className="ie-letter-kicker">We’re getting married</span>
          <span className="ie-letter-names">
            {bride} &amp; {groom}
          </span>
        </span>
        <span className="ie-front" />
        <span className="ie-flap" />
        <WaxSeal monogram={monogram} className="ie-seal" />
      </button>
      <p className="intro-hint">Tap the seal to open</p>
    </div>
  );
}
