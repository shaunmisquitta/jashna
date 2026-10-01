"use client";

import { useEffect } from "react";

export function PageHeightLogger() {
  useEffect(() => {
    let frame: number | null = null;

    const logPageHeight = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.scrollHeight;
        const ratio = width / height;
        const relativeHeight = height / width;
        console.log(
          `[Wedding card] Page: ${width}px × ${height}px | aspect ratio (W:H): ${ratio.toFixed(4)}:1 | 1:${relativeHeight.toFixed(4)}`,
        );
        frame = null;
      });
    };

    logPageHeight();
    window.addEventListener("load", logPageHeight);
    window.addEventListener("resize", logPageHeight);

    const observer = new ResizeObserver(logPageHeight);
    observer.observe(document.body);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("load", logPageHeight);
      window.removeEventListener("resize", logPageHeight);
      observer.disconnect();
    };
  }, []);

  return null;
}
