"use client";

import { useEffect, useState } from "react";
import { WaxSeal } from "./decor";

type Stage = "closed" | "opening" | "gone";
const CURTAIN_OPEN_MS = 1900;
const REVEAL_BUFFER_MS = 300;

// Full-screen theatre curtains. Tapping the monogram parts them to reveal the invitation.
export function Intro({ bride, groom, monogram }: { bride: string; groom: string; monogram: string }) {
  const [stage, setStage] = useState<Stage>("closed");

  useEffect(() => {
    if (stage === "closed") return;
    document.documentElement.classList.add("opened");
    const timer = setTimeout(() => setStage("gone"), CURTAIN_OPEN_MS + REVEAL_BUFFER_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  if (stage === "gone") return null;

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
  };

  return (
    <div
      className={`intro intro-${stage}`}
      style={{ "--curtain-duration": `${CURTAIN_OPEN_MS}ms` } as React.CSSProperties}
    >
      <button type="button" className="curtain-trigger" onClick={open} aria-label="Open invitation">
        <span className="curtain-stage-light" aria-hidden="true" />
        <span className="curtain curtain-left" aria-hidden="true">
          <span className="curtain-folds">
            {Array.from({ length: 8 }, (_, index) => <span className="curtain-fold" key={index} />)}
          </span>
          <span className="curtain-tie curtain-tie-left" />
        </span>
        <span className="curtain curtain-right" aria-hidden="true">
          <span className="curtain-folds">
            {Array.from({ length: 8 }, (_, index) => <span className="curtain-fold" key={index} />)}
          </span>
          <span className="curtain-tie curtain-tie-right" />
        </span>
        <span className="curtain-seam" aria-hidden="true" />
        <span className="curtain-sparks" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              className="curtain-spark"
              style={{
                "--angle": `${index * 20}deg`,
                "--distance": `${95 + (index % 5) * 24}px`,
                "--spark-size": `${3 + (index % 3) * 2}px`,
                "--spark-delay": `${0.05 + (index % 4) * 0.035}s`,
              } as React.CSSProperties}
              key={index}
            />
          ))}
        </span>
        <span className="curtain-center">
          <span className="intro-names">Jashna</span>
          <span className="curtain-couple">{bride} &amp; {groom}</span>
          <WaxSeal monogram={monogram} className="curtain-seal" />
        </span>
      </button>
    </div>
  );
}
