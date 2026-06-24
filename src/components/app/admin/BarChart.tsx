// src/components/app/admin/BarChart.tsx
// Tiny dependency-free horizontal bar chart for the admin reports. Pure +
// server-renderable: each row shows a label, a proportional bar, and a value.

export type Bar = { label: string; value: number; display: string };

export function BarChart({ bars }: { bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <div className="space-y-3">
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-ink-600 truncate">{b.label}</span>
          <div className="flex-1 h-6 rounded-lg bg-ink-50 overflow-hidden">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-brand-400 to-brand-600"
              style={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
            />
          </div>
          <span className="w-24 shrink-0 text-right text-sm font-600 text-ink-900 tabnum">
            {b.display}
          </span>
        </div>
      ))}
    </div>
  );
}
