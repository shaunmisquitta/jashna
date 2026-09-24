import type { CSSProperties } from "react";

const random = (index: number, salt: number) => {
  const value = Math.sin(index * 91.345 + salt * 47.123) * 43758.5453;
  return value - Math.floor(value);
};

const petals = Array.from({ length: 120 }, (_, index) => {
  const duration = 10 + random(index, 1) * 6;
  return {
    left: -2 + random(index, 3) * 104,
    duration,
    drift: -18 + random(index, 4) * 36,
    sway: -12 + random(index, 5) * 24,
    swayBack: -10 + random(index, 6) * 20,
    delay: random(index, 2) * 10,
    size: 15 + random(index, 7) * 22,
    spin: 240 + random(index, 8) * 620,
  };
});

type FlowerStyle = CSSProperties & Record<`--${string}`, string>;

export function FlowerShower() {
  return (
    <div className="flower-shower" aria-hidden="true">
      <svg className="flower-defs">
        <defs>
          <radialGradient id="rose-petal-color" cx="34%" cy="26%" r="82%">
            <stop offset="0" stopColor="#ff8a80" />
            <stop offset="0.4" stopColor="#e53935" />
            <stop offset="0.76" stopColor="#b20f24" />
            <stop offset="1" stopColor="#680013" />
          </radialGradient>
          <linearGradient id="rose-petal-fold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffb0a8" stopOpacity="0.62" />
            <stop offset="0.55" stopColor="#e6383c" stopOpacity="0.18" />
            <stop offset="1" stopColor="#4e0010" stopOpacity="0.5" />
          </linearGradient>
          <g id="rose-petal-shape">
            <path d="M20 3 C30 5 37 15 33 25 C30 34 22 39 15 35 C8 31 5 22 9 13 C12 7 16 5 20 3Z" fill="url(#rose-petal-color)" />
            <path d="M20 4 C20 14 18 25 15 34 C22 38 29 33 32 25 C35 16 29 8 20 4Z" fill="url(#rose-petal-fold)" />
            <path d="M20 5 C18 15 17 25 15 33" fill="none" stroke="#650015" strokeOpacity="0.38" strokeWidth="0.8" />
          </g>
        </defs>
      </svg>
      {petals.map(({ left, duration, drift, sway, swayBack, delay, size, spin }, index) => (
        <span
          className={`falling-flower rose-petal rose-petal-${index % 4}`}
          key={index}
          style={{
            "--left": `${left}%`,
            "--duration": `${duration}s`,
            "--drift": `${drift}vw`,
            "--sway": `${sway}vw`,
            "--sway-back": `${swayBack}vw`,
            "--delay": `${delay}s`,
            "--size": `${size}px`,
            "--spin-a": `${spin * 0.28}deg`,
            "--spin-b": `${spin * 0.56}deg`,
            "--spin-c": `${spin * 0.78}deg`,
            "--spin": `${spin}deg`,
          } as FlowerStyle}
        >
          <svg viewBox="0 0 40 40">
            <use href="#rose-petal-shape" />
          </svg>
        </span>
      ))}
    </div>
  );
}
