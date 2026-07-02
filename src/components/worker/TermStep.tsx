"use client";

// Step 0 of the worker flow. Worker insurance is a SINGLE ทิพยประกันภัย coverage
// package (illness IPD/OPD + accident) sold in 4 term lengths — the only choice
// here is the coverage term (เลือกระยะเวลาคุ้มครอง) plus how to enter workers.
// Personal lines (auto/travel/pa/fire) keep their multi-insurer comparison.
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { workerInsurancePlan, type WorkerTermId } from "@/config/insurance";
import { insurerPartners } from "@/lib/mock/seed";
import { TrustBadge } from "@/components/conversion/TrustBadge";
import type { WorkerMode } from "@/types";

export type TermStepProps = {
  termId: WorkerTermId;
  onTerm: (termId: WorkerTermId) => void;
  mode: WorkerMode;
  onMode: (mode: WorkerMode) => void;
  /** Admin toggle (WORKER_FLOW_UI): false hides the input-method chooser and
   *  the flow proceeds with the configured default mode. */
  showModePicker?: boolean;
};

export function TermStep({
  termId,
  onTerm,
  mode,
  onMode,
  showModePicker = true,
}: TermStepProps) {
  const t = useTranslations("worker");
  const baht = useBaht();
  const pkg = workerInsurancePlan;
  const insurer = insurerPartners.find((p) => p.id === pkg.insurerId);

  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-700 text-2xl text-ink-900">
        {t("package.heading")}
      </h2>
      <p className="text-ink-600 mt-1.5">{t("package.sub")}</p>

      {/* Privacy-first: real prices are visible here with zero personal data. */}
      {/* <TrustBadge variant="block" className="mt-4 max-w-md" /> */}

      {/* the ONLY product choice — 4 coverage terms, identical coverage */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {pkg.terms.map((term) => (
          <button
            key={term.id}
            onClick={() => onTerm(term.id)}
            className={cn("seg !p-4", termId === term.id && "is-on")}
            aria-pressed={termId === term.id}
          >
            <p className="font-600 text-ink-900">
              {t(`package.terms.${term.id}`)}
            </p>
            <p className="mt-1 font-display font-700 text-xl text-brand-700 tabnum">
              {baht(term.price)}
            </p>
            <p className="text-xs text-ink-400">{t("package.perPerson")}</p>
          </button>
        ))}
      </div>

      {/* fixed coverage — identical for every term, underwritten by ทิพยประกันภัย */}
      <div className="mt-5 card card-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {insurer?.logo && (
              <Image
                src={insurer.logo}
                alt={insurer.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl object-contain bg-white border border-ink-100"
                loading="lazy"
              />
            )}
            <div>
              <p className="font-600 text-ink-900">
                {t("package.underwrittenBy")}
              </p>
              <p className="text-xs text-ink-500">{t("package.insurerFull")}</p>
            </div>
          </div>
          <Chip className="bg-mint-50 text-mint-600 border border-mint-200">
            <Icon name="shieldCheck" size={14} /> {t("package.badgeSingle")}
          </Chip>
        </div>

        <p className="mt-5 font-600 text-ink-900">{t("package.coverageNote")}</p>

        <ul className="mt-3 space-y-2.5 text-sm text-ink-600">
          <li className="flex justify-between gap-4">
            <span>{t("package.rows.ipd")}</span>
            <span className="font-600 text-ink-900 text-right">
              {t("package.rows.ipdValue", { amount: baht(pkg.ipdMax) })}
            </span>
          </li>
          <li className="flex justify-between gap-4">
            <span>{t("package.rows.opd")}</span>
            <span className="font-600 text-ink-900 text-right">
              {t("package.rows.opdValue", {
                amount: baht(pkg.opdPerVisit),
                n: pkg.opdMaxVisits,
              })}
            </span>
          </li>
          <li className="flex justify-between gap-4">
            <span>{t("package.rows.age")}</span>
            <span className="font-600 text-ink-900 text-right">
              {t("package.rows.ageValue", { min: pkg.ageMin, max: pkg.ageMax })}
            </span>
          </li>
          <li className="flex items-center gap-2 text-mint-600 font-600">
            <Icon name="checkCircle" size={16} /> {t("package.noAdvance")}
          </li>
        </ul>

        <p className="mt-4 text-xs text-ink-500">{t("package.minorNote")}</p>
        <a
          href={pkg.hospitalNetworkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-600 text-brand-600 hover:text-brand-700"
        >
          {t("package.hospitalLink")} <Icon name="arrowRight" size={14} />
        </a>
      </div>

      {/* input-method chooser — admin-hideable; the flow then uses the default mode */}
      {showModePicker && (
        <>
          <h3 className="font-600 text-lg text-ink-900 mt-9">
            {t("package.modeHeading")}
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
                  <p className="font-600 text-ink-900">
                    {t("package.modeSingle.title")}
                  </p>
                  <p className="text-sm text-ink-500 mt-0.5">
                    {t("package.modeSingle.desc")}
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
                    {t("package.modeBulk.title")}
                    <Chip className="bg-gold-100 text-gold-600 !py-0 !px-1.5 text-[0.62rem]">
                      {t("package.modeBulk.badge")}
                    </Chip>
                  </p>
                  <p className="text-sm text-ink-500 mt-0.5">
                    {t("package.modeBulk.desc")}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
