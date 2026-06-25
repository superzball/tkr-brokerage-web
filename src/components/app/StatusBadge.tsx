// src/components/app/StatusBadge.tsx
// Semantic status badge (Phase 19). One component, zone-aware via tokens:
// friendly renders a soft tonal fill, premium renders an outline + leading dot.
// The caller supplies the localized label; `tone` picks the semantic colour.

import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

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
    <span className={cn("badge", className)} data-tone={tone}>
      {children}
    </span>
  );
}
