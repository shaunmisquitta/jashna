"use client";

import { useEffect, useState } from "react";
import { WaxSeal } from "./decor";

type Stage = "closed" | "opening" | "gone";
const CURTAIN_OPEN_MS = 1900;
const REVEAL_BUFFER_MS = 300;

function VelvetPanel({ side }: { side: "left" | "right" }) {
  const id = `velvet-${side}`;

  return (
    <svg className="curtain-art" viewBox="0 0 500 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-base`} x1="0" x2="1">
          <stop offset="0" stopColor="#26030c" />
          <stop offset="0.16" stopColor="#7f1730" />
          <stop offset="0.34" stopColor="#350711" />
          <stop offset="0.52" stopColor="#9f2943" />
          <stop offset="0.7" stopColor="#3a0713" />
          <stop offset="0.88" stopColor="#761329" />
          <stop offset="1" stopColor="#2a030d" />
        </linearGradient>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="0.86" y2="1">
          <stop offset="0" stopColor="#ffd9d2" stopOpacity=".22" />
          <stop offset=".34" stopColor="#c75468" stopOpacity=".07" />
          <stop offset=".72" stopColor="#140006" stopOpacity=".25" />
          <stop offset="1" stopColor="#050002" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" x2="1">
          <stop offset="0" stopColor="#76501a" />
          <stop offset=".45" stopColor="#f5d78a" />
          <stop offset=".72" stopColor="#b88732" />
          <stop offset="1" stopColor="#694411" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" width="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <rect width="500" height="1000" fill={`url(#${id}-base)`} />
      <rect width="500" height="1000" fill={`url(#${id}-light)`} />
      <g className="velvet-fold-shadows" fill="none" strokeLinecap="round">
        <path d="M42 -20 C76 175 25 356 68 535 C102 704 48 854 82 1025" />
        <path d="M142 -20 C182 180 117 342 164 535 C199 700 142 872 180 1025" />
        <path d="M252 -20 C292 164 219 365 274 548 C310 716 250 866 292 1025" />
        <path d="M365 -20 C405 180 332 348 390 540 C427 710 365 868 405 1025" />
        <path d="M470 -20 C500 172 444 360 486 548 C510 710 470 882 505 1025" />
      </g>
      <g className="velvet-fold-highlights" fill="none" strokeLinecap="round">
        <path d="M94 -20 C128 180 73 354 116 538 C150 704 100 868 132 1025" />
        <path d="M204 -20 C240 170 180 354 224 542 C262 708 204 866 242 1025" />
        <path d="M316 -20 C354 174 292 352 338 540 C374 708 318 870 354 1025" />
        <path d="M426 -20 C464 176 404 350 450 542 C482 710 432 874 468 1025" />
      </g>
      <path className="velvet-glow" d="M-40 100 C110 18 310 62 540 210 L540 430 C285 306 98 350 -40 440Z" />
      <path d="M0 968 C78 946 128 984 202 966 C281 945 340 987 410 968 C447 958 474 958 500 970 L500 1000 L0 1000Z" fill={`url(#${id}-gold)`} />
      <path d="M0 963 C92 941 132 978 204 960 C281 940 340 980 410 962 C449 952 478 954 500 964" fill="none" stroke="#f2d27d" strokeWidth="4" opacity=".82" />
    </svg>
  );
}

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
      <button
        type="button"
        className="curtain-trigger"
        onClick={open}
        onTouchStart={(event) => event.preventDefault()}
        onTouchEnd={(event) => {
          event.preventDefault();
          open();
        }}
        aria-label="Open invitation"
      >
        <span className="curtain-stage-light" aria-hidden="true" />
        <span className="curtain curtain-left" aria-hidden="true">
          <VelvetPanel side="left" />
          <span className="curtain-folds">
            {Array.from({ length: 8 }, (_, index) => <span className="curtain-fold" key={index} />)}
          </span>
          <span className="curtain-tie curtain-tie-left" />
        </span>
        <span className="curtain curtain-right" aria-hidden="true">
          <VelvetPanel side="right" />
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
