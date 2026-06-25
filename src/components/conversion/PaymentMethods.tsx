// src/components/conversion/PaymentMethods.tsx
// Checkout payment experience (Phase 18): pick a payment method from
// getCheckoutOptions() — full, credit-card 0% (≤10), QR PromptPay. The
// cash-installment option is shown ONLY when FEATURES.cashInstallment is on
// (finance-partner dependent, clearly labeled). Shows the instant-coverage note
// when instantCoverage.enabled. Copy is i18n'd; structure/flags come from seed.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { getCheckoutOptions, instantCoverage } from "@/lib/mock/seed";
import { FEATURES } from "@/config/features";
import type { CheckoutMethod } from "@/types/portal";

const METHOD_ICON: Record<CheckoutMethod, IconName> = {
  full: "wallet",
  card_installment: "creditcard",
  qr_promptpay: "qr",
  cash_installment: "coins",
};

export function PaymentMethods({
  onChange,
}: {
  onChange?: (method: CheckoutMethod) => void;
}) {
  const t = useTranslations("conversion.payment");

  // cash_installment is partner-dependent — gated behind the feature flag.
  const options = getCheckoutOptions().filter(
    (o) => o.method !== "cash_installment" || FEATURES.cashInstallment,
  );
  const [method, setMethod] = useState<CheckoutMethod>(options[0]?.method ?? "full");

  useEffect(() => {
    onChange?.(method);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  return (
    <div className="space-y-4">
      <label className="field-label">{t("title")}</label>
      <div className="grid gap-2.5">
        {options.map((o) => {
          const on = o.method === method;
          return (
            <button
              key={o.method}
              type="button"
              onClick={() => setMethod(o.method)}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                on ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-brand-300",
              )}
            >
              <span className={cn("w-5 h-5 rounded-full border-2 shrink-0 mt-0.5", on ? "border-brand-500 bg-brand-500" : "border-ink-300")} />
              <span className="w-9 h-9 rounded-lg bg-white text-brand-600 inline-flex items-center justify-center shrink-0 shadow-card">
                <Icon name={METHOD_ICON[o.method]} size={18} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="font-600 text-ink-900">{t(`methods.${o.method}.label`)}</span>
                  {o.partnerRequired && (
                    <span className="chip bg-amber-50 text-amber-700 text-[0.65rem]">{t("partnerBadge")}</span>
                  )}
                </span>
                <span className="block text-sm text-ink-500 mt-0.5">{t(`methods.${o.method}.detail`)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* instant-coverage note — keep as configurable, match underwriter terms */}
      {instantCoverage.enabled && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5">
          <span className="text-emerald-500 shrink-0 mt-0.5"><Icon name="shieldCheck" size={18} /></span>
          <div>
            <p className="text-sm font-600 text-emerald-800">{t("instantTitle")}</p>
            <p className="text-sm text-emerald-700 mt-0.5">{t("instantNote")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
