"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { AppLink } from "@/components/ui/AppLink";
import { useBaht } from "@/lib/format";
import { workerInsurancePlan, type WorkerTerm } from "@/config/insurance";
import { WorkerFaq } from "./WorkerFaq";

export function ReviewStep({
  count,
  term,
}: {
  count: number;
  term: WorkerTerm;
}) {
  const t = useTranslations("worker");
  const baht = useBaht();
  const pkg = workerInsurancePlan;

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
          <p className="font-600 text-ink-900 mt-1">{t("package.shortName")}</p>
          <p className="text-sm text-brand-700 font-600 mt-1">
            {t("package.underwrittenBy")}
          </p>
          <p className="text-sm text-ink-500 mt-2">
            {t("review.coveragePeriod", { term: t(`package.terms.${term.id}`) })}
          </p>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-600 text-ink-900">{t("review.listTitle")}</p>
          <Chip className="bg-mint-50 text-mint-600">
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
              {baht(term.price)}
            </p>
            <p className="text-xs text-ink-500">
              {t("review.perLabel", { term: t(`package.terms.${term.id}`) })}
            </p>
          </div>
          <div className="rounded-xl bg-brand-500 py-4 text-white">
            <p className="font-700 text-2xl tabnum">{baht(term.price * count)}</p>
            <p className="text-xs text-white/80">{t("review.totalLabel")}</p>
          </div>
        </div>
      </div>

      {/* compact "coverage & FAQ" reassurance before payment (spec placement B) */}
      <div className="card mt-4 p-5">
        <p className="font-600 text-ink-900 flex items-center gap-2">
          <span className="text-brand-600">
            <Icon name="shieldCheck" />
          </span>
          {t("faq.inflowTitle")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Chip className="bg-sky-100 text-brand-700">
            {t("package.rows.ipd")}{" "}
            {t("package.rows.ipdValue", { amount: baht(pkg.ipdMax) })}
          </Chip>
          <Chip className="bg-sky-100 text-brand-700">
            {t("package.rows.opd")}{" "}
            {t("package.rows.opdValue", {
              amount: baht(pkg.opdPerVisit),
              n: pkg.opdMaxVisits,
            })}
          </Chip>
          <Chip className="bg-mint-50 text-mint-600">
            {t("package.noAdvance")}
          </Chip>
          <Chip className="bg-white border border-ink-100 text-ink-600">
            {t("package.underwrittenBy")}
          </Chip>
        </div>
        <div className="mt-4">
          <WorkerFaq subset="inFlow" defaultOpen={-1} compact />
        </div>
        <AppLink
          href="/help/faq"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-600 text-brand-600 hover:text-brand-700"
        >
          {t("faq.viewAll")} <Icon name="arrowRight" size={14} />
        </AppLink>
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
