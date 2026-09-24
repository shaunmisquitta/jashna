import type { CSSProperties } from "react";

const blossoms = Array.from({ length: 200 }, (_, index) => {
  const duration = 5.8 + ((index * 13) % 32) / 10;
  const verticalPhase = ((index * 47) % 96) / 100;

  return {
    left: (index * 37) % 101,
    duration,
    drift: ((index * 29) % 51) - 25,
    delay: -(duration * verticalPhase),
    size: 24 + ((index * 17) % 49),
    spin: 720 + ((index * 97) % 900),
  };
});

type FlowerStyle = CSSProperties & Record<`--${string}`, string>;

export function FlowerShower() {
  return (
    <div className="flower-shower" aria-hidden="true">
      <svg className="flower-defs">
        <defs>
          <g id="sunflower-shape" className="flower-head">
            {Array.from({ length: 12 }, (_, petal) => petal * 30).map((rotation) => (
              <ellipse key={rotation} cx="20" cy="8" rx="4.2" ry="9.5" transform={`rotate(${rotation} 20 20)`} />
            ))}
            <circle cx="20" cy="20" r="8" fill="#5b351c" />
            <circle cx="20" cy="20" r="5.5" fill="#18120e" stroke="#8a5b25" strokeWidth="1.5" strokeDasharray="1.2 1.8" />
          </g>
        </defs>
      </svg>
      {blossoms.map(({ left, duration, drift, delay, size, spin }, index) => (
        <span
          className={`falling-flower sunflower-${index % 4}`}
          key={index}
          style={{
            "--left": `${left}%`,
            "--duration": `${duration}s`,
            "--drift": `${drift}vw`,
            "--delay": `${delay}s`,
            "--size": `${size}px`,
            "--spin": `${spin}deg`,
          } as FlowerStyle}
        >
          <svg viewBox="0 0 40 40">
            <use href="#sunflower-shape" />
          </svg>
        </span>
      ))}
    </div>
  );
}
