// src/components/brand/Mascot.tsx
// "Khun Koom" — TKR's original friendly guardian-shield mascot (insurance =
// protection). Drawn from scratch in the brand palette; NOT derived from any
// third-party character. Decorative — hidden from assistive tech by default.

import { cn } from "@/lib/cn";

export function Mascot({
  className,
  title,
}: {
  className?: string;
  /** When provided, the mascot becomes a labelled image instead of decorative. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 224"
      className={cn("select-none", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id="tkrm-body" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#4a85fb" />
          <stop offset="0.55" stopColor="#1f66ee" />
          <stop offset="1" stopColor="#0d44a3" />
        </linearGradient>
        <linearGradient id="tkrm-spark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6cf6b" />
          <stop offset="1" stopColor="#e89c12" />
        </linearGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="100" cy="210" rx="52" ry="9" fill="#0b2240" opacity="0.12" />

      {/* little arms (behind the body) */}
      <path
        d="M30 120c-12 4-20 13-21 25 0 4 4 6 7 4 7-5 14-8 22-9z"
        fill="#1f66ee"
      />
      <path
        d="M170 120c12 4 20 13 21 25 0 4-4 6-7 4-7-5-14-8-22-9z"
        fill="#1f66ee"
      />

      {/* shield body */}
      <path
        d="M100 16C76 6 46 10 30 18v92c0 46 30 78 70 96 40-18 70-50 70-96V18c-16-8-46-12-70-2z"
        fill="url(#tkrm-body)"
      />
      {/* inner bevel highlight */}
      <path
        d="M100 16C76 6 46 10 30 18v92c0 46 30 78 70 96V16z"
        fill="#ffffff"
        opacity="0.08"
      />

      {/* chest emblem — a clean check, the "covered" mark */}
      <path
        d="M82 118l12 12 26-28"
        fill="none"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* face */}
      <g>
        {/* cheeks */}
        <circle cx="68" cy="92" r="8" fill="#ff9b6b" opacity="0.55" />
        <circle cx="132" cy="92" r="8" fill="#ff9b6b" opacity="0.55" />
        {/* eyes */}
        <circle cx="82" cy="80" r="9.5" fill="#ffffff" />
        <circle cx="118" cy="80" r="9.5" fill="#ffffff" />
        <circle cx="84" cy="81" r="4.4" fill="#0b2240" />
        <circle cx="120" cy="81" r="4.4" fill="#0b2240" />
        <circle cx="86" cy="79" r="1.4" fill="#ffffff" />
        <circle cx="122" cy="79" r="1.4" fill="#ffffff" />
        {/* smile */}
        <path
          d="M86 98c5 6 23 6 28 0"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* sparkle accent */}
      <path
        d="M156 44l3.2 8.4 8.4 3.2-8.4 3.2-3.2 8.4-3.2-8.4-8.4-3.2 8.4-3.2z"
        fill="url(#tkrm-spark)"
      />
    </svg>
  );
}
