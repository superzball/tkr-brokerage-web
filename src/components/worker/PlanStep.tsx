"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { WORKER_PLANS } from "@/config/insurance";
import { TrustBadge } from "@/components/conversion/TrustBadge";
import type { WorkerMode, WorkerPlanId } from "@/types";

export type PlanStepProps = {
  plan: WorkerPlanId;
  mode: WorkerMode;
  onPlan: (plan: WorkerPlanId) => void;
  onMode: (mode: WorkerMode) => void;
};

export function PlanStep({ plan, mode, onPlan, onMode }: PlanStepProps) {
  const t = useTranslations("worker");
  const baht = useBaht();

  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-700 text-2xl text-ink-900">
        {t("plan.heading")}
      </h2>
      <p className="text-ink-600 mt-1.5">{t("plan.sub")}</p>

      {/* Privacy-first: a real price is visible here with zero personal data. */}
      <TrustBadge variant="block" className="mt-4 max-w-md" />

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {WORKER_PLANS.map((p) => (
          <div
            key={p.id}
            onClick={() => onPlan(p.id)}
            className={cn("plan-card p-5 relative", plan === p.id && "is-on")}
          >
            {p.recommended && (
              <Chip className="bg-brand-500 text-white absolute -top-2.5 left-5 text-xs">
                {t("plan.recommended")}
              </Chip>
            )}
            <p className="font-600 text-ink-900">{t(`plan.names.${p.id}`)}</p>
            <p className="mt-2 font-display font-700 text-3xl text-brand-700 tabnum">
              {baht(p.per)}
              <span className="text-sm font-500 text-ink-400">
                {t("plan.perUnit")}
              </span>
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-600">
              <li className="flex justify-between">
                <span>{t("plan.rows.life")}</span>
                <span className="font-600 text-ink-900">{baht(p.life)}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("plan.rows.medical")}</span>
                <span className="font-600 text-ink-900">{baht(p.medical)}</span>
              </li>
              <li className="flex justify-between">
                <span>{t("plan.rows.repatriation")}</span>
                <span
                  className={cn(
                    "font-600",
                    p.repatriation ? "text-emerald-600" : "text-ink-300",
                  )}
                >
                  {p.repatriation ? t("plan.included") : t("plan.notIncluded")}
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <h3 className="font-600 text-lg text-ink-900 mt-9">
        {t("plan.modeHeading")}
      </h3>
      <div className="mt-3 grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => onMode("single")}
          className={cn("seg", mode === "single" && "is-on")}
        >
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
              <Icon name="user" />
            </span>
            <div>
              <p className="font-600 text-ink-900">{t("plan.modeSingle.title")}</p>
              <p className="text-sm text-ink-500 mt-0.5">
                {t("plan.modeSingle.desc")}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => onMode("bulk")}
          className={cn("seg", mode === "bulk" && "is-on")}
        >
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
              <Icon name="users" />
            </span>
            <div>
              <p className="font-600 text-ink-900 flex items-center gap-1.5">
                {t("plan.modeBulk.title")}
                <Chip className="bg-gold-100 text-gold-600 !py-0 !px-1.5 text-[0.62rem]">
                  {t("plan.modeBulk.badge")}
                </Chip>
              </p>
              <p className="text-sm text-ink-500 mt-0.5">
                {t("plan.modeBulk.desc")}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
