"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { useBaht } from "@/lib/format";
import type { WorkerPlan } from "@/types";

export function ReviewStep({
  plan,
  count,
}: {
  plan: WorkerPlan;
  count: number;
}) {
  const t = useTranslations("worker");
  const baht = useBaht();

  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-700 text-2xl text-ink-900">
        {t("review.heading")}
      </h2>
      <p className="text-ink-600 mt-1.5">{t("review.sub")}</p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-sm text-ink-500">{t("review.holder")}</p>
          <p className="font-600 text-ink-900 mt-1">{t("review.company")}</p>
          <p className="text-sm text-ink-500 mt-2">{t("review.taxId")}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink-500">{t("review.planLabel")}</p>
          <p className="font-600 text-ink-900 mt-1">
            {t(`plan.names.${plan.id}`)}
          </p>
          <p className="text-sm text-ink-500 mt-2">{t("review.coveragePeriod")}</p>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-600 text-ink-900">{t("review.listTitle")}</p>
          <Chip className="bg-emerald-50 text-emerald-600">
            {t("review.readyChip", { n: count })}
          </Chip>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-sky-100 py-4">
            <p className="font-700 text-2xl text-brand-700 tabnum">{count}</p>
            <p className="text-xs text-ink-500">{t("review.countLabel")}</p>
          </div>
          <div className="rounded-xl bg-sky-100 py-4">
            <p className="font-700 text-2xl text-brand-700 tabnum">
              {baht(plan.per)}
            </p>
            <p className="text-xs text-ink-500">{t("review.perLabel")}</p>
          </div>
          <div className="rounded-xl bg-brand-500 py-4 text-white">
            <p className="font-700 text-2xl tabnum">{baht(plan.per * count)}</p>
            <p className="text-xs text-white/80">{t("review.totalLabel")}</p>
          </div>
        </div>
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-ink-600 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 accent-brand-500"
          defaultChecked
        />{" "}
        {t("review.confirmText")}
        <a href="#" className="text-brand-600 underline">
          {t("review.confirmLink")}
        </a>
      </label>
    </div>
  );
}
