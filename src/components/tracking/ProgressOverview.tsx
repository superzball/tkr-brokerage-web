import { useTranslations } from "next-intl";
import { TRACK_COUNTS, TRACK_PROGRESS } from "@/config/tracking";

export function ProgressOverview() {
  const t = useTranslations("tracking");

  const boxes: Array<{
    key: "issued" | "processing" | "problem";
    value: number;
    box: string;
    num: string;
  }> = [
    { key: "issued", value: TRACK_COUNTS.issued, box: "bg-emerald-50", num: "text-emerald-600" },
    { key: "processing", value: TRACK_COUNTS.processing, box: "bg-sky-100", num: "text-brand-600" },
    { key: "problem", value: TRACK_COUNTS.problem, box: "bg-ink-50", num: "text-ink-400" },
  ];

  return (
    <div className="card p-6 reveal">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-600 text-lg text-ink-900">{t("overview.title")}</h2>
          <p className="text-sm text-ink-500">{t("overview.subtitle")}</p>
        </div>
        <p className="font-display font-700 text-3xl text-brand-700 tabnum">
          {TRACK_PROGRESS}%
        </p>
      </div>
      <div className="h-3 rounded-full bg-sky-200 overflow-hidden">
        <div
          className="h-full rounded-full sheen"
          style={{
            width: `${TRACK_PROGRESS}%`,
            background: "linear-gradient(90deg,#1f66ee,#0f52c7)",
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        {boxes.map((b) => (
          <div key={b.key} className={`rounded-xl py-3.5 ${b.box}`}>
            <p className={`font-700 text-2xl tabnum ${b.num}`}>{b.value}</p>
            <p className="text-xs text-ink-500">{t(`stats.${b.key}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
