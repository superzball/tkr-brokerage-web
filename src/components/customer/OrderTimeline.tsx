import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { CUSTOMER_TIMELINE } from "@/config/customer";
import { ROUTES } from "@/config/nav";

export function OrderTimeline() {
  const t = useTranslations("customer");
  const last = CUSTOMER_TIMELINE.length - 1;

  return (
    <div className="card p-6 reveal">
      <h3 className="font-600 text-ink-900 mb-5 flex items-center gap-2">
        <span className="text-brand-600">
          <Icon name="truck" />
        </span>{" "}
        {t("timeline.title")}
      </h3>
      <div>
        {CUSTOMER_TIMELINE.map((step, i) => (
          <div key={step.key} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "w-7 h-7 rounded-full inline-flex items-center justify-center shrink-0",
                  step.state === "done"
                    ? "bg-mint-500 text-white"
                    : step.state === "current"
                      ? "bg-brand-500 text-white animate-pulse"
                      : "bg-white border-2 border-ink-100 text-ink-300",
                )}
              >
                {step.state === "done" ? (
                  <Icon name="check" size={14} />
                ) : step.state === "current" ? (
                  <Icon name="clock" size={14} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-300" />
                )}
              </span>
              {i < last && (
                <span
                  className={cn(
                    "w-0.5 flex-1 my-1",
                    step.state === "done" ? "bg-mint-300" : "bg-ink-100",
                  )}
                  style={{ minHeight: "18px" }}
                />
              )}
            </div>
            <div className="pb-3">
              <p
                className={cn(
                  "text-sm",
                  step.state === "current"
                    ? "font-600 text-brand-700"
                    : step.state === "done"
                      ? "font-500 text-ink-800"
                      : "font-500 text-ink-400",
                )}
              >
                {t(`timeline.steps.${step.key}.t`)}
              </p>
              <p className="text-xs text-ink-400">
                {t(`timeline.steps.${step.key}.d`)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button
        href={ROUTES.tracking}
        variant="ghost"
        size="sm"
        className="w-full mt-4"
      >
        {t("timeline.viewTracking")}
      </Button>
    </div>
  );
}
