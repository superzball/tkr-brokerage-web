// src/components/app/StatusBadge.tsx
// Small status pill (built on the .chip class). The caller supplies the
// localized label; `tone` controls the colour.

import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-gold-50 text-gold-600",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-sky-100 text-brand-700",
  neutral: "bg-ink-50 text-ink-600",
};

export function StatusBadge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("chip", TONE[tone], className)}>{children}</span>
  );
}
