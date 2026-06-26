// src/components/conversion/CouponInstallment.tsx
// Checkout building block: apply a coupon code (applyCoupon) + pick an installment
// plan (installmentPlans, incl. 0%). Reports {discount, total, months} upward so
// the host checkout can show the final amount. Mock — no real payment.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { AppLink } from "@/components/ui/AppLink";
import { TextField } from "@/components/ui/Field";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { applyCoupon, installmentPlans } from "@/lib/mock/seed";
import type { InsuranceType } from "@/types/portal";

export type CouponInstallmentState = {
  code: string | null;
  discount: number;
  total: number;
  months: number;
};

export function CouponInstallment({
  product,
  subtotal,
  onChange,
}: {
  product: InsuranceType;
  subtotal: number;
  onChange?: (s: CouponInstallmentState) => void;
}) {
  const t = useTranslations("conversion.coupon");
  const ti = useTranslations("conversion.installment");
  const baht = useBaht();

  const [input, setInput] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [error, setError] = useState(false);
  const [months, setMonths] = useState(0);

  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  useEffect(() => {
    onChange?.({ code: applied?.code ?? null, discount, total, months });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount, total, months, applied]);

  function tryApply() {
    const code = input.trim().toUpperCase();
    if (!code) return;
    const d = applyCoupon(code, product, subtotal);
    if (d > 0) {
      setApplied({ code, discount: d });
      setError(false);
    } else {
      setApplied(null);
      setError(true);
    }
  }

  return (
    <div className="space-y-5">
      {/* coupon */}
      <div>
        <label className="field-label">{t("label")}</label>
        {applied ? (
          <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-mint-50 border border-mint-100 px-3.5 py-2.5">
            <span className="inline-flex items-center gap-2 text-sm font-600 text-mint-600">
              <Icon name="checkCircle" size={16} />
              {t("applied", { code: applied.code })} · −{baht(applied.discount)}
            </span>
            <button
              type="button"
              onClick={() => { setApplied(null); setInput(""); }}
              className="text-xs font-600 text-mint-600 hover:underline"
            >
              {t("remove")}
            </button>
          </div>
        ) : (
          <div className="mt-1 flex gap-2">
            <TextField
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder={t("placeholder")}
              className="flex-1"
            />
            <Button variant="ghost" size="md" type="button" onClick={tryApply}>
              {t("apply")}
            </Button>
          </div>
        )}
        {error && <p className="mt-1.5 text-xs text-rose-600">{t("invalid")}</p>}
        <AppLink href="/promotions" className="mt-1.5 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
          <Icon name="gift" size={13} /> {t("available")}
        </AppLink>
      </div>

      {/* installments */}
      <div>
        <label className="field-label">{ti("label")}</label>
        <div className="mt-1 grid gap-2">
          {installmentPlans.map((p) => {
            const on = p.months === months;
            const perMonth = p.months > 0 ? Math.ceil(total / p.months) : total;
            return (
              <button
                key={p.months}
                type="button"
                onClick={() => setMonths(p.months)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  on ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-brand-300",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className={cn("w-4 h-4 rounded-full border-2 shrink-0", on ? "border-brand-500 bg-brand-500" : "border-ink-300")} />
                  <span className="text-sm font-600 text-ink-900">{p.label}</span>
                  {p.months > 0 && p.rate === 0 && (
                    <span className="chip bg-mint-50 text-mint-600 text-[0.65rem]">{ti("interestFree")}</span>
                  )}
                </span>
                {p.months > 0 && (
                  <span className="text-sm font-600 text-brand-700 tabnum">
                    {ti("perMonth", { amount: baht(perMonth) })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* total breakdown */}
      <div className="rounded-xl bg-ink-50 p-4 text-sm space-y-1.5">
        <div className="flex justify-between text-ink-500">
          <span>{t("subtotal")}</span>
          <span className="tabnum">{baht(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-mint-600">
            <span>{t("discount")}</span>
            <span className="tabnum">−{baht(discount)}</span>
          </div>
        )}
        <div className="h-px bg-ink-200 my-1" />
        <div className="flex justify-between items-center">
          <span className="font-600 text-ink-700">{ti("label")}</span>
          <span className="font-700 text-xl text-brand-700 tabnum">{baht(total)}</span>
        </div>
      </div>
    </div>
  );
}
