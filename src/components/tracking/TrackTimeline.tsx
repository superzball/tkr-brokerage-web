import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { TRACK_PROGRESS, TRACK_STAGES } from "@/config/tracking";

export function TrackTimeline() {
  const t = useTranslations("tracking");
  const last = TRACK_STAGES.length - 1;

  return (
    <div className="card p-6 sm:p-8 reveal">
      <h2 className="font-600 text-lg text-ink-900 mb-7">
        {t("timelineTitle")}
      </h2>
      <div>
        {TRACK_STAGES.map((s, i) => (
          <div key={s.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "w-11 h-11 rounded-full inline-flex items-center justify-center shrink-0",
                  s.state === "done"
                    ? "bg-mint-500 text-white shadow-glow"
                    : s.state === "current"
                      ? "bg-brand-500 text-white ring-4 ring-brand-100"
                      : "bg-white border-2 border-ink-100 text-ink-300",
                )}
              >
                {s.state === "done" ? (
                  <Icon name="check" />
                ) : s.state === "current" ? (
                  <Icon name="clock" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-ink-200" />
                )}
              </span>
              {i < last && (
                <span
                  className={cn(
                    "w-0.5 flex-1 my-2",
                    s.state === "done" ? "bg-mint-300" : "bg-ink-100",
                  )}
                  style={{ minHeight: "42px" }}
                />
              )}
            </div>
            <div className="pb-7 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className={cn(
                    "font-600",
                    s.state === "current"
                      ? "text-brand-700 text-lg"
                      : s.state === "done"
                        ? "text-ink-900"
                        : "text-ink-400",
                  )}
                >
                  {t(`stages.${s.key}.t`)}
                </p>
                {s.state === "current" && (
                  <Chip className="bg-brand-50 text-brand-600 text-xs">
                    {t("timeline.currentBadge")}
                  </Chip>
                )}
                {s.state === "done" && (
                  <span className="text-mint-500">
                    <Icon name="checkCircle" size={18} />
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "text-xs mt-1",
                  s.state === "pending" ? "text-ink-300" : "text-ink-400",
                )}
              >
                {t(`stages.${s.key}.d`)}
              </p>
              <p
                className={cn(
                  "text-sm mt-2 leading-relaxed",
                  s.state === "pending" ? "text-ink-400" : "text-ink-600",
                )}
              >
                {t(`stages.${s.key}.desc`)}
              </p>
              {s.state === "current" && (
                <div className="mt-3 h-2 rounded-full bg-sky-200 overflow-hidden max-w-xs">
                  <div
                    className="h-full rounded-full sheen"
                    style={{
                      width: `${TRACK_PROGRESS}%`,
                      background: "linear-gradient(90deg,#1f66ee,#0f52c7)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
