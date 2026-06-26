// src/components/app/admin/BarChart.tsx
// Tiny dependency-free horizontal bar chart for the admin (premium) reports.
// Pure + server-renderable: each row shows a label, a proportional bar, and a
// value. Same light palette as the rest of the app — deep brand-blue bars on a
// soft track, with the leading bar picked out in the gold precision accent.

import { cn } from "@/lib/cn";

export type Bar = { label: string; value: number; display: string };

export function BarChart({ bars }: { bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <div className="space-y-2.5">
      {bars.map((b) => {
        const lead = b.value === max; // highlight the leader in gold
        return (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-ink-600 truncate">{b.label}</span>
            <div className="flex-1 h-5 rounded-md bg-sky-50 overflow-hidden ring-1 ring-inset ring-ink-100/70">
              <div
                className={cn(
                  "h-full rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
                  lead
                    ? "bg-gradient-to-r from-gold-300 to-gold-500"
                    : "bg-gradient-to-r from-brand-400 to-brand-600",
                )}
                style={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
              />
            </div>
            <span className="w-24 shrink-0 text-right text-sm font-600 text-ink-900 tabnum">
              {b.display}
            </span>
          </div>
        );
      })}
    </div>
  );
}
