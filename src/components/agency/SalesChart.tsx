import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { AGENCY_CHART_DATA, AGENCY_CHART_MAX } from "@/config/agency";

/**
 * Monthly sales bar chart — a direct port of the inline-SVG `chart()` in
 * agency.js (viewBox 0 0 100 118). The รายเดือน / รายไตรมาส toggle is purely
 * visual in the original (no handler), so it stays as static styled buttons.
 */
export function SalesChart() {
  const t = useTranslations("agency.chart");
  const months = t.raw("months") as string[];

  const data = AGENCY_CHART_DATA;
  const max = AGENCY_CHART_MAX;
  const W = 100;
  const H = 100;
  const n = data.length;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - (v / max) * H;

  const toggles: Array<{ key: "monthly" | "quarterly"; on: boolean }> = [
    { key: "monthly", on: true },
    { key: "quarterly", on: false },
  ];

  return (
    <div className="lg:col-span-2 card p-6 reveal">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-600 text-lg text-ink-900">{t("title")}</h2>
          <p className="text-sm text-ink-500">{t("subtitle")}</p>
        </div>
        <div className="flex gap-1.5 text-xs">
          {toggles.map((tg) => (
            <button
              key={tg.key}
              className={cn(
                "chip",
                tg.on ? "bg-brand-500 text-white" : "bg-sky-100 text-ink-500",
              )}
            >
              {t(tg.key)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56">
        <svg
          viewBox="0 0 100 118"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {[0, 2.5, 5, 7.5, 10].map((g) => {
            const gy = H - (g / max) * H;
            return (
              <line
                key={g}
                x1="0"
                y1={gy.toFixed(1)}
                x2="100"
                y2={gy.toFixed(1)}
                stroke="#e7eef9"
                strokeWidth="0.4"
              />
            );
          })}
          {data.map((v, i) => {
            const cur = i === n - 1;
            return (
              <rect
                key={i}
                x={(x(i) - 2.6).toFixed(1)}
                y={y(v).toFixed(1)}
                width="5.2"
                height={(H - y(v)).toFixed(1)}
                rx="1.4"
                fill={cur ? "#e89c12" : "#1f66ee"}
                opacity={cur ? 1 : 0.85}
              />
            );
          })}
          {months.map((m, i) => (
            <text
              key={m}
              x={x(i).toFixed(1)}
              y="112"
              fontSize="4.4"
              fill="#9db4d0"
              textAnchor="middle"
              fontFamily="Anuphan"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
