"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "zoom" | "drop" | "fade";

// Fades/slides its children in the first time they scroll into view.
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "header" | "footer";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={{ ...style, "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
