// src/components/ui/Confetti.tsx
// CSS-only celebratory confetti for quote/purchase success beats. No animation
// library — each piece is a positioned <span> driven by the `confetti-fall`
// keyframe (globals.css). Load it lazily (next/dynamic, ssr:false) so the JS
// only ships when a success screen renders. Honors prefers-reduced-motion.

"use client";

import { useMemo } from "react";

// Brand palette — brand / mint / gold / peach / sky.
const COLORS = ["#1f66ee", "#14ad76", "#f2b736", "#fb8a3c", "#7caaff"];

// Deterministic pseudo-random (pure — no Math.random in render). Varied enough
// for scattered confetti; same layout every mount, which is fine here.
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 99.13 + salt * 7.71) * 43758.5453;
  return x - Math.floor(x);
};

export function Confetti({ count = 70 }: { count?: number }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rand(i, 1) * 100,
        delay: rand(i, 2) * 0.6,
        dur: 2.4 + rand(i, 3) * 1.8,
        color: COLORS[i % COLORS.length],
        w: 6 + rand(i, 4) * 6,
        rot: rand(i, 5) * 360,
      })),
    [count],
  );

  if (reduce) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-6vh",
            width: p.w,
            height: p.w * 0.6,
            background: p.color,
            borderRadius: 1,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall ${p.dur}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
