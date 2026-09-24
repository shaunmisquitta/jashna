"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const nowSeconds = () => Math.floor(Date.now() / 1000);

export function Countdown({ date }: { date: string }) {
  // null during SSR so the server never renders a stale time
  const now = useSyncExternalStore(subscribe, nowSeconds, () => null);
  const target = Math.floor(new Date(date).getTime() / 1000);
  const left = now === null ? null : Math.max(0, target - now);

  if (left === 0) {
    return <p className="countdown-done">The big day is here!</p>;
  }

  const parts = [
    { label: "Days", value: left === null ? null : Math.floor(left / 86400) },
    { label: "Hours", value: left === null ? null : Math.floor((left % 86400) / 3600) },
    { label: "Minutes", value: left === null ? null : Math.floor((left % 3600) / 60) },
    { label: "Seconds", value: left === null ? null : left % 60 },
  ];

  return (
    <div className="countdown" role="timer" aria-live="off">
      {parts.map((p, i) => (
        <div key={p.label} className="cd-unit">
          <span className="cd-num">
            {p.value === null ? (
              "--"
            ) : (
              <span key={p.value} className="cd-flip">
                {String(p.value).padStart(2, "0")}
              </span>
            )}
          </span>
          {i < parts.length - 1 && <span className="cd-sep">:</span>}
          <span className="cd-label">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
