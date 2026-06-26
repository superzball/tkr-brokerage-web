"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up to its value the first time it scrolls into view (Phase 19,
 * friendly motion). Only animates purely-numeric strings (e.g. "12,800"); mixed
 * values like "> 1 Million" render as-is. Honors prefers-reduced-motion.
 */
export function AnimatedCounter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const pure = /^[\d,]+$/.test(value.trim());
  const target = pure ? parseInt(value.replace(/,/g, ""), 10) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(pure ? "0" : value);

  useEffect(() => {
    // Non-numeric values render as-is (initial state already holds them).
    if (!pure) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip the count-up; settle on the final value (deferred so it's not a
      // synchronous setState inside the effect body).
      raf = requestAnimationFrame(() => setDisplay(target.toLocaleString()));
      return () => cancelAnimationFrame(raf);
    }

    const animate = () => {
      const duration = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(target * eased).toLocaleString());
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            animate();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pure, target]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
