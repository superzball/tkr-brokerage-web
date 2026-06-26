// src/components/conversion/TaxCalculator.tsx
// Optional tax-saving calculator (Phase 18) — gated behind FEATURES.taxTools at
// the route level (default OFF). Income + deductions → tax before/after + tax
// saved, using taxDeductionCaps. PLANNING ESTIMATE ONLY — labeled clearly as
// "ใช้ยื่นภาษีจริงไม่ได้". Caps are public Revenue rules; verify each tax year.

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { AppLink } from "@/components/ui/AppLink";
import { FieldLabel } from "@/components/ui/Field";
import { useBaht } from "@/lib/format";
import { getTaxDeductionCaps } from "@/lib/mock/seed";
import type { TaxCalcInput, TaxCalcResult } from "@/types/portal";

// Thai personal income tax brackets (progressive). Verify against the tax year.
const BRACKETS: { upTo: number; rate: number }[] = [
  { upTo: 150_000, rate: 0 },
  { upTo: 300_000, rate: 0.05 },
  { upTo: 500_000, rate: 0.1 },
  { upTo: 750_000, rate: 0.15 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: 2_000_000, rate: 0.25 },
  { upTo: 5_000_000, rate: 0.3 },
  { upTo: Infinity, rate: 0.35 },
];

function progressiveTax(taxable: number): number {
  let tax = 0;
  let prev = 0;
  for (const b of BRACKETS) {
    if (taxable <= prev) break;
    const slice = Math.min(taxable, b.upTo) - prev;
    tax += slice * b.rate;
    prev = b.upTo;
  }
  return Math.max(0, Math.round(tax));
}

// caps from seed: lifeHealth 100k for insurance, rmf 500k as the funds umbrella
const INSURANCE_CAP = 100_000;
const FUNDS_CAP = 500_000;

function compute(input: TaxCalcInput): TaxCalcResult {
  const base = Math.max(
    0,
    input.annualIncome - input.personalAllowance - input.socialSecurity,
  );
  const deductible =
    Math.min(input.existingInsurance, INSURANCE_CAP) +
    Math.min(input.funds, FUNDS_CAP);
  const taxableIncome = Math.max(0, base - deductible);
  const taxBefore = progressiveTax(base);
  const taxAfter = progressiveTax(taxableIncome);
  return { taxableIncome, taxBefore, taxAfter, taxSaved: Math.max(0, taxBefore - taxAfter) };
}

type Field = keyof TaxCalcInput;
const FIELDS: Field[] = ["annualIncome", "personalAllowance", "socialSecurity", "existingInsurance", "funds"];

export function TaxCalculator() {
  const t = useTranslations("tax");
  const baht = useBaht();

  const [input, setInput] = useState<TaxCalcInput>({
    annualIncome: 600_000,
    personalAllowance: 60_000,
    socialSecurity: 9_000,
    existingInsurance: 0,
    funds: 0,
  });

  const result = useMemo(() => compute(input), [input]);
  const set = (k: Field, v: string) =>
    setInput((s) => ({ ...s, [k]: Math.max(0, Number(v.replace(/[^\d]/g, "")) || 0) }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-xl bg-brand-500 text-white inline-flex items-center justify-center shrink-0">
          <Icon name="coins" />
        </span>
        <div>
          <h1 className="font-display font-700 text-2xl sm:text-3xl text-ink-900">{t("title")}</h1>
          <p className="text-sm text-ink-600">{t("sub")}</p>
        </div>
      </div>

      {/* planning-estimate disclaimer */}
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 p-3.5">
        <span className="text-amber-600 shrink-0 mt-0.5"><Icon name="alertTri" size={18} /></span>
        <p className="text-sm text-amber-800">{t("disclaimer")}</p>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* inputs */}
        <div className="card p-6 space-y-4">
          {FIELDS.map((f) => (
            <div key={f}>
              <FieldLabel>{t(`inputs.${f}.label`)}</FieldLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">฿</span>
                <input
                  inputMode="numeric"
                  value={input[f].toLocaleString("en-US")}
                  onChange={(e) => set(f, e.target.value)}
                  className="field pl-7 tabnum"
                />
              </div>
              <p className="text-xs text-ink-400 mt-1">{t(`inputs.${f}.hint`)}</p>
            </div>
          ))}

          <div className="pt-2">
            <p className="field-label mb-2">{t("capsTitle")}</p>
            <ul className="rounded-xl border border-ink-100 divide-y divide-ink-50 text-sm">
              {getTaxDeductionCaps().map((c) => (
                <li key={c.key} className="flex items-center justify-between gap-3 px-3.5 py-2">
                  <span className="text-ink-600">{c.label}</span>
                  <span className="font-600 text-ink-900 tabnum">{t("cap", { amount: baht(c.cap) })}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* results */}
        <div className="card card-lg p-6 lg:sticky lg:top-[84px] space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-mint-500 to-mint-600 text-white p-5 text-center">
            <p className="text-sm text-mint-50">{t("results.taxSaved")}</p>
            <p className="font-display font-700 text-4xl tabnum mt-1">{baht(result.taxSaved)}</p>
          </div>
          <dl className="text-sm space-y-2.5">
            <div className="flex justify-between"><dt className="text-ink-500">{t("results.taxableIncome")}</dt><dd className="font-600 text-ink-900 tabnum">{baht(result.taxableIncome)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">{t("results.taxBefore")}</dt><dd className="font-600 text-ink-900 tabnum">{baht(result.taxBefore)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">{t("results.taxAfter")}</dt><dd className="font-600 text-brand-700 tabnum">{baht(result.taxAfter)}</dd></div>
          </dl>

          <div className="pt-4 border-t border-ink-100">
            <p className="text-sm font-600 text-ink-900">{t("suggestTitle")}</p>
            <p className="text-xs text-ink-500 mt-0.5">{t("suggestSub")}</p>
            <div className="mt-3 grid gap-2">
              <AppLink href="/insurance/tax-savings" className="btn btn-ghost btn-md justify-between">
                {t("plans.savings")} <Icon name="arrowRight" size={16} />
              </AppLink>
              <AppLink href="/insurance/tax-annuity" className="btn btn-ghost btn-md justify-between">
                {t("plans.annuity")} <Icon name="arrowRight" size={16} />
              </AppLink>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-400">{t("footnote")}</p>
    </div>
  );
}
