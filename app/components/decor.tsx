import type { CSSProperties, ReactNode } from "react";
import { assetPath } from "../asset-path";

// Deterministic RNG so server and client render identical SVG.
function rng(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}
const f = (n: number) => n.toFixed(1);

/* ------------------------------------------------------------------ */
/* Shared <defs>: gradients, filters and clip paths used across the page */
/* ------------------------------------------------------------------ */

export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <defs>
        {/* ragged, torn-paper edge */}
        <filter id="torn" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.08  0 0 0 0.35 0" />
        </filter>

        <radialGradient id="sealGold" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f3dc9a" />
          <stop offset="0.35" stopColor="#d2a650" />
          <stop offset="0.75" stopColor="#9c7327" />
          <stop offset="1" stopColor="#6f4f16" />
        </radialGradient>
        <radialGradient id="sealInner" cx="60%" cy="65%" r="70%">
          <stop offset="0" stopColor="#e2bd6a" />
          <stop offset="1" stopColor="#a47b2c" />
        </radialGradient>

        <radialGradient id="anthGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#a3243c" />
          <stop offset="0.45" stopColor="#650d20" />
          <stop offset="1" stopColor="#2c030b" />
        </radialGradient>
        <linearGradient id="spadix" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe2b8" />
          <stop offset="1" stopColor="#a7844a" />
        </linearGradient>

        <linearGradient id="weddingWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e2cf" />
          <stop offset="0.55" stopColor="#ecd2c0" />
          <stop offset="1" stopColor="#d9b49c" />
        </linearGradient>
        <linearGradient id="drape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="0.45" stopColor="#efe3d2" />
          <stop offset="0.7" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#e2d2bd" />
        </linearGradient>
        <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7df97" />
          <stop offset="0.5" stopColor="#d4a445" />
          <stop offset="1" stopColor="#9c7327" />
        </linearGradient>
        <radialGradient id="roseIvory" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="1" stopColor="#e6d7bd" />
        </radialGradient>
        <radialGradient id="rosePink" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fbdcd8" />
          <stop offset="1" stopColor="#d99a9a" />
        </radialGradient>
        <radialGradient id="roseWine" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#a8344a" />
          <stop offset="1" stopColor="#5e0f1f" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="varnish" cx="50%" cy="45%" r="70%">
          <stop offset="0.55" stopColor="#1d1406" stopOpacity="0" />
          <stop offset="1" stopColor="#1d1406" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="wineFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6c1a2b" />
          <stop offset="1" stopColor="#3f0913" />
        </linearGradient>

        {/* white "cut-out sticker" outline + soft shadow for the couple */}
        <filter id="sticker" x="-15%" y="-10%" width="130%" height="120%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="grown" />
          <feGaussianBlur in="grown" stdDeviation="3" result="blur" />
          <feOffset in="blur" dx="0" dy="3" result="shadowShape" />
          <feFlood floodColor="#1d1406" floodOpacity="0.45" />
          <feComposite in2="shadowShape" operator="in" result="shadow" />
          <feFlood floodColor="#fffaf0" />
          <feComposite in2="grown" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id="archInner">
          <path d={archPath(16, 16, 288, 384)} />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ---------------- Wax seal ---------------- */

const sealBlob = (() => {
  const rand = rng(21);
  const pts = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    const rad = 46 + rand() * 4 - (i % 7 === 0 ? 3 : 0);
    return [50 + Math.cos(a) * rad, 50 + Math.sin(a) * rad];
  });
  let d = `M${f((pts[0][0] + pts[19][0]) / 2)} ${f((pts[0][1] + pts[19][1]) / 2)}`;
  pts.forEach((p, i) => {
    const n = pts[(i + 1) % pts.length];
    d += `Q${f(p[0])} ${f(p[1])} ${f((p[0] + n[0]) / 2)} ${f((p[1] + n[1]) / 2)}`;
  });
  return d + "Z";
})();

export function WaxSeal({
  monogram,
  className = "",
  style,
}: {
  monogram: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" className={`seal ${className}`} style={style} aria-hidden>
      <path d={sealBlob} fill="url(#sealGold)" />
      <circle cx="50" cy="50" r="33" fill="url(#sealInner)" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#6f4f16" strokeOpacity="0.55" strokeWidth="2.2" />
      <circle cx="50.8" cy="50.8" r="35.5" fill="none" stroke="#fbeab8" strokeOpacity="0.45" strokeWidth="1" />
      <text x="50.8" y="61.2" textAnchor="middle" className="seal-text" fill="#fbe8b0" fillOpacity="0.55">
        {monogram}
      </text>
      <text x="50" y="60.5" textAnchor="middle" className="seal-text" fill="#6a4a12">
        {monogram}
      </text>
    </svg>
  );
}

/* ---------------- Anthurium flower ---------------- */

export function Anthurium({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 -24 120 150" className={`anthurium ${className}`} style={style} aria-hidden>
      {/* spathe: glossy, elongated heart with a pointed tip */}
      <path
        d="M60 122 C 46 100 14 78 10 50 C 7 28 26 14 44 20 C 52 23 57 29 60 36 C 63 29 68 23 76 20 C 94 14 113 28 110 50 C 106 78 74 100 60 122 Z"
        fill="url(#anthGrad)"
      />
      <g fill="none" stroke="#1d0207" strokeOpacity="0.4" strokeWidth="0.8">
        <path d="M60 38 C 52 60 52 90 60 120" />
        <path d="M60 38 C 68 60 68 90 60 120" />
        <path d="M60 38 C 36 42 20 58 30 82" />
        <path d="M60 38 C 84 42 100 58 90 82" />
        <path d="M60 38 C 44 50 36 70 44 96" />
        <path d="M60 38 C 76 50 84 70 76 96" />
      </g>
      <path d="M22 36 C 28 24 42 22 50 30 C 38 30 30 38 26 50 Z" fill="#fff" opacity="0.22" />
      <path d="M78 30 C 88 26 98 30 100 38 C 94 34 86 34 80 36 Z" fill="#fff" opacity="0.12" />
      {/* spadix */}
      <path d="M60 40 C 57 20 62 2 80 -14" stroke="#6b5530" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M60 40 C 57 20 62 2 80 -14" stroke="url(#spadix)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ---------------- Olive tag with tassel ---------------- */

const tagShape = (() => {
  const bumps = 12;
  const cx = 60;
  const cy = 72;
  let d = "";
  for (let i = 0; i <= bumps; i++) {
    const a = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * 46;
    const y = cy + Math.sin(a) * 50;
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = a - Math.PI / bumps;
      d += `Q${f(cx + Math.cos(m) * 56)} ${f(cy + Math.sin(m) * 60)} ${f(x)} ${f(y)}`;
    }
  }
  return d + "Z";
})();

export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`tag ${className}`}>
      <svg viewBox="0 0 120 200" aria-hidden>
        <path d="M60 0 V16" stroke="#b8893a" strokeWidth="1.5" />
        <path d={tagShape} fill="#6c7350" />
        <path d={tagShape} fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="1" transform="translate(1 1.5)" />
        <ellipse cx="60" cy="72" rx="38" ry="42" fill="none" stroke="#f2ecd9" strokeOpacity="0.45" strokeDasharray="2 3" />
        <circle cx="60" cy="24" r="3.2" fill="#3f4330" />
        <g className="tassel">
          <path d="M60 128 V142" stroke="#b8893a" strokeWidth="1.5" />
          <circle cx="60" cy="144" r="4.5" fill="#c79a47" />
          <path d="M55 148 h10 l4 44 h-18 z" fill="#b8893a" />
          <g stroke="#8a6322" strokeWidth="0.7">
            <path d="M57 150 L55 191M60 150 V191M63 150 L65 191M58.5 150 L57.5 191M61.5 150 L62.5 191" />
          </g>
          <path d="M54 152 h12" stroke="#e2c07a" strokeWidth="2" />
        </g>
      </svg>
      <span className="tag-label">{children}</span>
    </span>
  );
}

/* ---------------- Arch framed wedding scene ---------------- */

function archPath(x: number, y: number, w: number, h: number) {
  const sh = w * 0.055;
  const sy = y + w * 0.3;
  const cy = y + (sy - y) * 0.3;
  return (
    `M${x} ${y + h}V${f(sy)}H${f(x + sh)}` +
    `C${f(x + sh)} ${f(cy)} ${f(x + w * 0.27)} ${y} ${f(x + w / 2)} ${y}` +
    `C${f(x + w * 0.73)} ${y} ${f(x + w - sh)} ${f(cy)} ${f(x + w - sh)} ${f(sy)}` +
    `H${x + w}V${y + h}Z`
  );
}

/* Wedding scene inside the arch: a rose-garland arch, tied-back drapes, fairy
   lights and an aisle, with the couple standing together and a golden ribbon
   "tying the knot" between them. Only their upper half shows above the
   envelope pocket, so they appear to peek out as it opens. */

const roseColors = ["url(#roseIvory)", "url(#rosePink)", "url(#roseWine)", "url(#rosePink)", "url(#roseIvory)"];

// Rose clusters along an ellipse that follows the arch top and runs down the sides.
const garland = (() => {
  const rand = rng(41);
  const items: { x: number; y: number; r: number; c: string; leaf: number }[] = [];
  const n = 34;
  for (let k = 0; k < n; k++) {
    const a = Math.PI * (0.92 + (1.16 * k) / (n - 1)); // just past 9 o'clock → just past 3 o'clock
    const x = 160 + Math.cos(a) * 128 + (rand() - 0.5) * 6;
    const y = 158 + Math.sin(a) * 124 + (rand() - 0.5) * 6;
    items.push({ x, y, r: 6 + rand() * 6, c: roseColors[k % roseColors.length], leaf: rand() * 360 });
  }
  return items;
})();

const bokeh = (() => {
  const rand = rng(57);
  return Array.from({ length: 22 }, () => ({
    x: 30 + rand() * 260,
    y: 40 + rand() * 230,
    r: 2 + rand() * 7,
    o: 0.25 + rand() * 0.45,
    d: rand() * 4,
  }));
})();

const lightStrings = [60, 96, 132, 188, 224, 260].map((x, i) => ({ x, len: 110 + ((i * 37) % 70) }));

const petals = (() => {
  const rand = rng(77);
  return Array.from({ length: 9 }, () => ({ x: 40 + rand() * 240, d: rand() * 9, s: 7 + rand() * 5, r: rand() * 360 }));
})();

function Rose({ x, y, r, c, leaf }: { x: number; y: number; r: number; c: string; leaf: number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <ellipse rx={f(r * 0.9)} ry={f(r * 0.4)} fill="#6f7a4a" transform={`rotate(${f(leaf)}) translate(${f(r * 0.9)} 0)`} />
      <ellipse rx={f(r * 0.8)} ry={f(r * 0.35)} fill="#56613a" transform={`rotate(${f(leaf + 140)}) translate(${f(r * 0.85)} 0)`} />
      <circle r={f(r)} fill={c} />
      {/* petal edges and a shaded centre */}
      <path
        d={`M${f(-r * 0.75)} ${f(r * 0.1)}q${f(r * 0.75)} ${f(r * 0.7)} ${f(r * 1.5)} 0M${f(-r * 0.55)} ${f(-r * 0.35)}q${f(r * 0.55)} ${f(-r * 0.45)} ${f(r * 1.1)} 0`}
        fill="none"
        stroke="#000"
        strokeOpacity="0.14"
        strokeWidth="0.7"
      />
      <circle cx={f(r * 0.05)} cy={f(-r * 0.05)} r={f(r * 0.38)} fill="#000" opacity="0.12" />
    </g>
  );
}

export function ArchPainting({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 400" className={`arch ${className}`} aria-hidden>
      <path d={archPath(0, 0, 320, 400)} fill="url(#wineFrame)" />
      <g clipPath="url(#archInner)">
        {/* warm candle-lit backdrop */}
        <rect width="320" height="400" fill="url(#weddingWall)" />
        <ellipse className="p-glow" cx="160" cy="190" rx="130" ry="120" fill="url(#glow)" />
        {/* church-window doorway behind the couple */}
        <path d={archPath(78, 64, 164, 340)} fill="#fff8ee" opacity="0.55" />
        <path d={archPath(78, 64, 164, 340)} fill="none" stroke="#c9a46a" strokeOpacity="0.5" strokeWidth="1.2" />
        <path d="M160 64 V404 M78 190 H242" stroke="#c9a46a" strokeOpacity="0.25" strokeWidth="1" />

        {/* fairy-light strings */}
        {lightStrings.map((l, i) => (
          <g key={i}>
            <path d={`M${l.x} 16 V${16 + l.len}`} stroke="#b89b6a" strokeOpacity="0.45" strokeWidth="0.6" />
            {Array.from({ length: Math.floor(l.len / 14) }, (_, k) => (
              <circle
                key={k}
                className="twinkle"
                cx={l.x}
                cy={24 + k * 14}
                r="1.6"
                fill="#fff3c4"
                style={{ animationDelay: `${((i * 5 + k * 3) % 10) * 0.25}s` }}
              />
            ))}
          </g>
        ))}
        {bokeh.map((b, i) => (
          <circle
            key={i}
            className="twinkle"
            cx={f(b.x)}
            cy={f(b.y)}
            r={f(b.r)}
            fill="#fffaf0"
            opacity={f(b.o)}
            style={{ animationDelay: `${f(b.d)}s` }}
          />
        ))}

        {/* aisle */}
        <path d="M0 318 H320 V400 H0Z" fill="#e8d2bd" />
        <path d="M128 318 H192 L236 400 H84Z" fill="#7a1f33" opacity="0.85" />
        <path d="M128 318 H192" stroke="#c9a46a" strokeWidth="1.5" />

        {/* tied-back drapes */}
        <g className="drape">
          <path d="M16 16 C 70 30 96 110 70 176 C 58 210 48 290 58 404 H16Z" fill="url(#drape)" />
          <path d="M34 20 C 70 60 78 130 60 180 M52 190 C 44 250 42 330 46 404" stroke="#000" strokeOpacity="0.07" strokeWidth="1.2" fill="none" />
          <path d="M48 178 q18 -6 28 4 q-12 10 -30 4z" fill="#c9a46a" />
        </g>
        <g className="drape" transform="translate(320 0) scale(-1 1)">
          <path d="M16 16 C 70 30 96 110 70 176 C 58 210 48 290 58 404 H16Z" fill="url(#drape)" />
          <path d="M34 20 C 70 60 78 130 60 180 M52 190 C 44 250 42 330 46 404" stroke="#000" strokeOpacity="0.07" strokeWidth="1.2" fill="none" />
          <path d="M48 178 q18 -6 28 4 q-12 10 -30 4z" fill="#c9a46a" />
        </g>

        {/* rose garland following the arch */}
        <g className="garland">
          {garland.map((g, i) => (
            <Rose key={i} {...g} />
          ))}
        </g>

        {/* drifting petals */}
        {petals.map((p, i) => (
          <g key={i} className="petal" style={{ animationDelay: `${f(-p.d)}s` }}>
            <path
              d={`M${f(p.x)} 0 q${f(p.s * 0.6)} ${f(-p.s * 0.2)} ${f(p.s * 0.5)} ${f(p.s * 0.6)} q${f(-p.s * 0.4)} ${f(p.s * 0.3)} ${f(-p.s * 0.5)} ${f(-p.s * 0.6)}z`}
              fill={i % 3 === 0 ? "#9b2a3c" : "#f1b9b9"}
              transform={`rotate(${f(p.r)} ${f(p.x)} 0)`}
            />
          </g>
        ))}

        <rect width="320" height="400" fill="url(#varnish)" opacity="0.6" />
        <rect width="320" height="400" filter="url(#grain)" opacity="0.4" />

        <g className="couple" filter="url(#sticker)">
          <g className="couple-bride">
            <image href={assetPath("/bride.webp")} x="34" y="72" width="176" height="331" />
          </g>
          <g className="couple-groom">
            <image href={assetPath("/groom.webp")} x="186" y="76" width="113" height="330" />
          </g>
        </g>

        {/* the knot: a golden ribbon from her dupatta to his stole, tied between them */}
        <g className="knot">
          <path
            className="knot-ribbon"
            pathLength={1}
            d="M150 212 C 162 222 174 222 186 208 C 196 198 208 198 222 206 M186 208 c -14 -18 -30 -6 -20 4 c 7 7 16 3 20 -4 c 5 -16 26 -14 20 0 c -4 8 -14 8 -20 0 M185 211 c -5 16 -12 30 -20 42 M187 211 c 5 16 13 28 21 38"
          />
          <circle className="knot-core" cx="186" cy="209" r="4.4" fill="url(#goldRibbon)" />
        </g>
      </g>
      <path d={archPath(16, 16, 288, 384)} fill="none" stroke="#260409" strokeOpacity="0.6" strokeWidth="2" />
    </svg>
  );
}

/* ---------------- Envelope pieces ---------------- */

export function EnvelopePocket({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 230" preserveAspectRatio="none" className={className} aria-hidden>
      <path d="M0 0 L200 118 L0 230Z" fill="#5c1423" />
      <path d="M400 0 L200 118 L400 230Z" fill="#561220" />
      <path d="M0 230 L200 108 L400 230Z" fill="#661a2a" />
      <path d="M0 230 L200 108 L400 230" fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="1.5" />
      <path d="M0 0 L200 118 L400 0" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1" />
    </svg>
  );
}

export function SmallEnvelope({ monogram }: { monogram: string }) {
  return (
    <div className="small-env">
      <svg viewBox="0 0 200 130" aria-hidden>
        <rect width="200" height="130" rx="3" fill="#5a1423" />
        <path d="M0 130 L80 62 M200 130 L120 62" stroke="#000" strokeOpacity="0.2" />
        <path d="M0 0 L100 78 L200 0Z" fill="#6a1b2c" />
        <path d="M0 0 L100 78 L200 0" fill="none" stroke="#000" strokeOpacity="0.25" />
      </svg>
      <WaxSeal monogram={monogram} className="small-env-seal" />
    </div>
  );
}

/* ---------------- Line icons ---------------- */

const iconPaths: Record<string, ReactNode> = {
  ceremony: (
    <>
      <path d="M4 21V10l8-6 8 6v11M2 21h20" />
      <path d="M9.5 21v-5a2.5 2.5 0 0 1 5 0v5M12 4V1.5M10.8 2.6h2.4" />
    </>
  ),
  cocktail: (
    <>
      <path d="M4 5h16l-8 8.5z M12 13.5V20 M8 21h8" />
      <path d="M15 8.5l4-6 M18.2 2.2a1.6 1.6 0 1 1 0 .1" />
    </>
  ),
  cheers: (
    <>
      <path d="M4 4.5l5-1 .6 5.2a2.5 2.5 0 0 1-4.8 1z M7.5 11l1.4 7 M6.5 19l4.5-.9" />
      <path d="M20 4.5l-5-1-.6 5.2a2.5 2.5 0 0 0 4.8 1z M16.5 11l-1.4 7 M17.5 19l-4.5-.9" />
      <path d="M12 1v2M9.8 1.6l.8 1.4M14.2 1.6l-.8 1.4" />
    </>
  ),
  dinner: (
    <>
      <circle cx="12" cy="12.5" r="6" />
      <circle cx="12" cy="12.5" r="3.6" />
      <path d="M2.5 4v5a1.5 1.5 0 0 0 3 0V4M4 9v12M21 4c-1.8 2-1.8 6.5 0 7.5V21" />
    </>
  ),
  party: (
    <>
      <path d="M12 1v5" />
      <circle cx="12" cy="12.5" r="6.5" />
      <path d="M5.5 12.5h13M12 6v13M7 8.5c3 1.5 7 1.5 10 0M7 16.5c3-1.5 7-1.5 10 0" />
      <path d="M20 3l.6 1.4L22 5l-1.4.6L20 7l-.6-1.4L18 5l1.4-.6zM3.5 3.5l.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4z" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 10h12v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z M16 11.5h1.8a2.2 2.2 0 0 1 0 4.4H16 M3 21.5h14" />
      <path d="M8 2.5c-1 1.2 1 2 0 3.5M12 2.5c-1 1.2 1 2 0 3.5" />
    </>
  ),
  haldi: (
    <>
      {/* marigold */}
      <circle cx="12" cy="11" r="2.2" />
      <path d="M12 8.8c-1.2-1.6-1.2-3.6 0-5 1.2 1.4 1.2 3.4 0 5zM12 13.2c-1.2 1.6-1.2 3.6 0 5 1.2-1.4 1.2-3.4 0-5zM9.8 11c-1.6-1.2-3.6-1.2-5 0 1.4 1.2 3.4 1.2 5 0zM14.2 11c1.6 1.2 3.6 1.2 5 0-1.4-1.2-3.4-1.2-5 0z" />
      <path d="M10.4 9.4c-.4-1.9-1.8-3.3-3.6-3.6.3 1.8 1.7 3.2 3.6 3.6zM13.6 9.4c.4-1.9 1.8-3.3 3.6-3.6-.3 1.8-1.7 3.2-3.6 3.6zM10.4 12.6c-.4 1.9-1.8 3.3-3.6 3.6.3-1.8 1.7-3.2 3.6-3.6zM13.6 12.6c.4 1.9 1.8 3.3 3.6 3.6-.3-1.8-1.7-3.2-3.6-3.6z" />
      <path d="M12 18.2V22M9.5 21.5c1-.9 1.8-1.1 2.5-1 .7-.1 1.5.1 2.5 1" />
    </>
  ),
  reception: (
    <>
      <path d="M5 3h5l-.4 5a2.1 2.1 0 0 1-4.2 0zM7.5 10.2V19M5.5 19.5h4M14 3h5l-.4 5a2.1 2.1 0 0 1-4.2 0zM16.5 10.2V19M14.5 19.5h4" />
      <path d="M12 2v2.5M10.3 3l.8 1.3M13.7 3l-.8 1.3" />
    </>
  ),
};

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {iconPaths[name]}
    </svg>
  );
}

/* ---------------- Old handwritten letter ---------------- */

const letterText =
  "My dearest, from the very first day I knew my life would take on a new colour beside you. Every morning with you is a promise kept, every evening a song I never want to end. I write these lines to remind you that true love is never in a hurry; it blossoms slowly, like the trees in the garden where we first met. ";

export function OldLetter({ className = "" }: { className?: string }) {
  return (
    <div className={`old-letter ${className}`} aria-hidden>
      <p>{letterText.repeat(3)}</p>
    </div>
  );
}

/* ---------------- "Jashna" hand-lettered title ---------------- */

// Traced from the supplied lettering artwork, so it renders exactly like the original.
export function JashnaLettering({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="79 55 385 148" className={className} role="img" aria-label="Jashna">
      <path fill="currentColor" fillRule="evenodd" d="M 215 63.3 C 193.7 69.2 189.4 70.7 182.5 74.5 C 172.1 80.2 166.6 87.6 166.5 95.8 C 166.5 100.7 166.7 101.4 170.2 104.5 C 172.2 106.4 174.9 107.9 176.2 107.9 C 178.2 107.9 178.1 107.7 175.4 106.6 C 169.4 103.9 168.4 97.1 172.9 89.3 C 178.3 79.8 189.3 72.8 207.2 67.1 C 212.6 65.3 217.2 64 217.6 64 C 217.9 64 215.7 66.6 212.6 69.9 C 206.5 76.5 196.3 96.0 191.6 110 C 188.3 119.9 183.5 132.9 180.9 138.8 L 178.9 143.5 163.7 143.5 C 147.1 143.4 143.3 144.4 135.1 150.6 C 128.4 155.8 127.6 164.1 133.6 166.8 C 137.0 168.4 139.1 168.2 136 166.7 C 130.9 164.1 132.7 155.5 139.2 150.6 C 145.6 145.7 150.6 144.4 162.5 144.5 C 179.0 144.7 178.8 144.5 173.5 155.6 C 160.4 183.2 142.7 195.8 120.9 192.8 C 104.1 190.5 94.4 180.7 94.5 166 C 94.6 156.5 97.6 150.1 105.8 142.0 C 121.1 126.9 143.0 123.6 155.7 134.5 C 160.6 138.7 161.4 137.6 156.8 133.1 C 141.8 118.5 103.1 129.2 93.2 150.7 C 80.6 178.1 108.1 201.7 142.4 193.0 C 160.1 188.4 174.8 175.8 185.0 156.2 C 186.8 152.8 188.6 150 189.0 150 C 189.5 150 198.5 153.8 209.1 158.6 C 247.4 175.6 269.3 182.5 289 183.6 C 316.9 185.1 338.5 175.6 342.4 160 C 342.7 158.6 341.9 159.5 340.5 162.1 C 337.5 167.8 333.3 171.4 325.5 175.1 C 316.4 179.4 310.3 180.3 294 179.7 C 274.4 178.9 258.5 174.8 225.4 161.9 C 213.1 157.1 192.9 149.4 190.2 148.5 C 189.3 148.1 189.5 146.8 191.1 143.2 C 193.3 138.1 199.8 120.1 205.6 103 C 215.1 74.9 222.1 63.1 231 60.3 C 240.2 57.3 228.7 59.5 215 63.3 M 321.4 62.8 C 305.5 68.2 293.8 84.9 283.4 116.7 C 281.7 122.0 279.0 124.9 273.7 126.9 C 271.2 127.8 271.0 127.5 267.5 120.3 C 263.1 111.0 263.0 107.1 266.8 102.8 C 271.2 97.9 273.4 101.2 269.1 106.2 C 267.8 107.8 267.8 108.0 269.1 107.5 C 269.9 107.1 271.4 105.5 272.3 103.9 C 274.1 101.0 274.1 100.7 272.4 98.9 C 266.7 92.6 255.6 102.8 257.5 112.6 C 258.5 117.5 239.1 145 234.6 145 C 230.5 145 233.8 135.3 246.7 109.7 C 247.4 108.3 240.4 108.9 238.3 110.4 C 236.4 111.7 236.0 111.7 234.9 110.4 C 234.2 109.5 232.0 109 229.3 109 C 213.4 109 195.7 133.7 204.0 144.3 C 208.0 149.4 214.8 147.4 222.1 139.0 L 226.5 134.1 226.1 139.0 C 225.7 144.9 227.0 147 231.2 147 C 237.3 147 244.0 139.9 255.0 122.2 L 258.3 116.9 260.1 122.7 C 262.4 130.1 262.4 130.6 259.6 131.3 C 252.9 133.0 245.0 141.0 245.0 146.1 C 244.9 150.6 247.5 152.2 253.6 151.7 C 263.1 150.9 270.9 142.9 271.0 134.0 C 271.0 129.6 271.1 129.4 275.5 127.4 C 277.9 126.2 280 125.5 280 125.9 C 280 126.2 278.2 131.1 276.0 136.8 L 272.1 147.1 276.7 146.8 L 281.3 146.5 283.6 140.5 C 288.7 127.5 295.8 116.5 301.4 113.0 C 308.5 108.6 308.7 111.8 302.3 126.1 C 295.2 141.7 295.3 148 302.5 148 C 308.0 148 312.0 143.4 318.9 129.5 C 326.2 114.8 328.2 112 331.5 112 C 335.2 112 334.7 114.5 327.8 131.2 C 324.5 139.4 322.0 146.3 322.3 146.6 C 322.6 146.9 324.6 146.9 326.7 146.5 C 330.5 145.9 330.8 145.5 333.4 139.1 C 338.4 126.8 349.9 111 353.8 111 C 357.6 111 356.6 116.1 349.6 132.5 C 345.3 142.4 346.6 148 353.1 148 C 357.1 148 361.2 145.7 364.4 141.7 C 366.8 138.7 366.9 138.6 366.9 140.7 C 367.0 144.1 371.2 148 375.0 148 C 379.4 148 383.1 145.7 388.1 140.0 L 392.5 135.1 392.5 141.0 C 392.5 148.5 396.1 153.9 404 158.3 C 409.2 161.3 410.0 161.5 420.5 161.4 C 430.7 161.4 431.9 161.2 438.1 158.3 C 453.6 151.0 461.3 137.3 454.5 129.2 C 450.9 124.9 447.1 123.7 439.2 124.1 C 430.7 124.6 425.0 127.3 417.3 134.5 L 411.5 140.1 417.2 135.5 C 433.1 123.0 447.8 121.6 451.8 132.2 C 458.2 149.2 428.0 167.7 409.2 158.4 C 396.9 152.3 396.7 143.7 408.4 119.8 C 410.9 114.7 413 110.2 413 109.7 C 413 108.3 406.2 108.9 405.0 110.4 C 403.9 111.7 403.5 111.7 401.6 110.4 C 396.0 106.5 384.9 109.8 377.3 117.6 C 373.1 122.0 367.0 132.6 367.0 135.7 C 367 137.6 358.5 146 356.6 146 C 354.0 146 354.6 142.7 359.1 132.1 C 365.7 116.6 365.3 109 357.7 109 C 353.5 109 349.7 111.3 344.7 117.0 L 340.2 122.1 340.7 117.2 C 341.2 111.5 339.5 109 335.0 109 C 329.2 109 325.9 112.7 318.4 127.2 C 311.4 140.9 307.1 146.8 305.1 145.5 C 303.5 144.6 304.5 141.1 309.1 131.8 C 315.3 119.1 316.5 114.5 314.5 111.5 C 310.8 105.7 300.0 109.5 293.6 118.8 C 292.0 121.1 290.5 122.9 290.4 122.7 C 290.2 122.5 291.1 119.5 292.4 116.0 C 294.5 110.0 295.1 109.3 302.6 104.1 C 324.4 88.9 339.2 67.7 331.7 62.5 C 328.9 60.6 327.7 60.6 321.4 62.8 M 323.4 63.8 C 318.2 66.2 311.2 74.1 306.6 82.7 C 302.3 91.0 295.8 106.1 296.3 106.6 C 297.1 107.4 314.6 93.1 319.4 87.8 C 329.5 76.6 334.0 67.1 331.0 63.5 C 329.4 61.5 328.4 61.6 323.4 63.8 M 226.0 113.2 C 218.9 117.9 209.4 135.1 210.1 141.7 C 211.1 150.0 221.8 140.4 231.4 122.6 C 233.4 118.8 234.9 114.7 234.8 113.6 C 234.3 110.5 230.1 110.3 226.0 113.2 M 392.4 112.8 C 381.8 119.3 370.2 146 378.1 146 C 380.5 146 387.2 139.9 391.1 134.2 C 395.7 127.5 402.0 114.2 401.3 112.5 C 400.5 110.4 396.1 110.6 392.4 112.8 M 256.9 133.9 C 248.1 138.6 243.6 149.0 250.0 149.7 C 255.0 150.3 262 141.8 262 135.0 C 262 131.5 261.7 131.4 256.9 133.9" />
    </svg>
  );
}
