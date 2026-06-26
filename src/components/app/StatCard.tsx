// src/components/app/StatCard.tsx
// Dashboard KPI tile: icon, label, big tabular value, optional trend chip and
// optional sparkline. Friendly-zone treatment — soft brand-tinted card that
// lifts on hover. `tone`, `spark` and `hint` are additive/optional; existing
// call sites (icon/label/value[/delta/deltaTone]) render unchanged.

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Icon-tile accent. Defaults to brand so existing usage is unchanged.
 *  "ink" is the neutral/institutional tile used by the premium (admin) zone. */
type Tone = "brand" | "mint" | "gold" | "peach" | "ink";

const TONE_TILE: Record<Tone, string> = {
  brand: "bg-sky-100 text-brand-600",
  mint: "bg-mint-50 text-mint-600",
  gold: "bg-gold-50 text-gold-600",
  peach: "bg-peach-50 text-peach-600",
  ink: "bg-ink-50 text-ink-600",
};
const SPARK_STROKE: Record<Tone, string> = {
  brand: "#1f66ee",
  mint: "#14ad76",
  gold: "#e89c12",
  peach: "#f2701a",
  ink: "#475569",
};

/** Tiny inline sparkline (no axes/labels) — decorative trend cue. */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const w = 96;
  const h = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  const gid = `spk-${color.replace("#", "")}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-24 h-7 overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaTone = "up",
  tone = "brand",
  spark,
  hint,
}: {
  icon: IconName;
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  /** Icon-tile + sparkline accent. Default "brand". */
  tone?: Tone;
  /** Optional series for the sparkline. */
  spark?: number[];
  /** Optional sub-label under the value (e.g. period). */
  hint?: string;
}) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-500 text-ink-500">{label}</span>
        <span
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            TONE_TILE[tone],
          )}
        >
          <Icon name={icon} size={18} />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-3xl font-700 text-ink-900 tabnum leading-none">
            {value}
          </div>
          {hint && <div className="mt-1.5 text-xs text-ink-400">{hint}</div>}
        </div>
        {spark && spark.length > 1 && (
          <Sparkline data={spark} color={SPARK_STROKE[tone]} />
        )}
      </div>

      {delta && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-600",
            deltaTone === "up" && "bg-mint-50 text-mint-600",
            deltaTone === "down" && "bg-rose-50 text-rose-600",
            deltaTone === "flat" && "bg-ink-50 text-ink-500",
          )}
        >
          {deltaTone !== "flat" && (
            <Icon
              name="arrowUpRight"
              size={13}
              className={deltaTone === "down" ? "rotate-90" : ""}
            />
          )}
          {delta}
        </div>
      )}
    </div>
  );
}
