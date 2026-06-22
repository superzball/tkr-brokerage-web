import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import {
  AGENCY_CURRENT_TIER,
  AGENCY_TIERS,
  TIER_RAIL_PROGRESS,
} from "@/config/agency";

export function TierSection() {
  const t = useTranslations("agency.tier");
  const tt = useTranslations("agency.tiers");
  const curIdx = AGENCY_TIERS.findIndex((x) => x.key === AGENCY_CURRENT_TIER);

  return (
    <section id="tier" className="mt-8 card p-6 sm:p-8 reveal">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div>
          <h2 className="font-display font-700 text-2xl text-ink-900">
            {t("title")}
          </h2>
          <p className="text-ink-600 mt-1">{t("subtitle")}</p>
        </div>
        <Chip className="bg-gold-100 text-gold-600">{t("currentBadge")}</Chip>
      </div>

      {/* tier progress rail */}
      <div className="relative mb-9 px-2">
        <div className="absolute left-0 right-0 top-5 h-1.5 rounded-full bg-sky-200" />
        <div
          className="absolute left-0 top-5 h-1.5 rounded-full"
          style={{
            width: `${TIER_RAIL_PROGRESS}%`,
            background: "linear-gradient(90deg,#1f66ee,#e89c12)",
          }}
        />
        <div className="relative grid grid-cols-4 gap-2">
          {AGENCY_TIERS.map((tier, i) => {
            const state = i < curIdx ? "done" : i === curIdx ? "cur" : "";
            return (
              <div key={tier.key} className="tier-node">
                <span className={cn("tier-dot", state)}>
                  <Icon name={tier.icon} />
                </span>
                <span
                  className={cn(
                    "text-xs font-600",
                    i === curIdx
                      ? "text-gold-600"
                      : i < curIdx
                        ? "text-brand-600"
                        : "text-ink-400",
                  )}
                >
                  {tt(`${tier.key}.name`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* tier cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AGENCY_TIERS.map((tier, i) => {
          const isCur = i === curIdx;
          const done = i < curIdx;
          const next = i === curIdx + 1;
          const perks = tt.raw(`${tier.key}.perks`) as string[];
          return (
            <div
              key={tier.key}
              className={cn(
                "rounded-2xl p-5 border-2 relative",
                isCur
                  ? "border-gold-400 bg-gold-50"
                  : next
                    ? "border-brand-200 bg-sky-50"
                    : "border-ink-100 bg-white",
              )}
            >
              {isCur && (
                <Chip className="bg-gold-400 text-ink-900 absolute -top-2.5 left-5 text-xs font-700">
                  {t("youAreHere")}
                </Chip>
              )}
              {next && (
                <Chip className="bg-brand-500 text-white absolute -top-2.5 left-5 text-xs">
                  {t("nextStep")}
                </Chip>
              )}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "w-10 h-10 rounded-xl inline-flex items-center justify-center",
                    isCur
                      ? "bg-gold-400 text-white"
                      : done
                        ? "bg-brand-500 text-white"
                        : "bg-sky-100 text-brand-600",
                  )}
                >
                  <Icon name={tier.icon} />
                </span>
                {done && (
                  <span className="text-emerald-500">
                    <Icon name="checkCircle" />
                  </span>
                )}
              </div>
              <p className="mt-3 font-display font-700 text-lg text-ink-900">
                {tt(`${tier.key}.name`)}
              </p>
              <p className="text-xs text-ink-500">
                {t("cumulative")} {tt(`${tier.key}.threshold`)}
              </p>
              <p className="mt-3 font-700 text-2xl text-brand-700 tabnum">
                {tier.comm}
                <span className="text-xs font-500 text-ink-400">
                  {" "}
                  {t("commLabel")}
                </span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-ink-600">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <span className="text-emerald-500 shrink-0">
                      <Icon name="check" size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
