"use client";

import { useEffect, useState } from "react";

export function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY < 80);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollDown = () => {
    document.querySelector(".player-wrap")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      className={`scroll-cue${visible ? "" : " scroll-cue-hidden"}`}
      onClick={scrollDown}
      aria-label="Scroll down to continue through the invitation"
    >
      <span>Scroll Down</span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
