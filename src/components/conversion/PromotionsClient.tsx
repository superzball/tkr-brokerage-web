// src/components/conversion/PromotionsClient.tsx
// Public promotions page — active coupons with copy-to-clipboard codes. Codes
// feed the checkout coupon field (applyCoupon). Mock data from the seed store.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/app/EmptyState";
import { useBaht } from "@/lib/format";
import type { Coupon } from "@/types/portal";

export function PromotionsClient({ coupons }: { coupons: Coupon[] }) {
  const t = useTranslations("promotions");
  const tp = useTranslations("admin.product");
  const baht = useBaht();
  const [copied, setCopied] = useState<string | null>(null);

  const active = coupons.filter((c) => c.active);

  if (active.length === 0) {
    return <EmptyState icon="gift" title={t("empty")} />;
  }

  function copy(code: string) {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {active.map((c) => {
        const products =
          c.products.includes("all")
            ? t("allProducts")
            : c.products.map((p) => tp(p as "worker")).join(", ");
        const discount =
          c.discountType === "percent" ? `${c.value}%` : baht(c.value);
        return (
          <div key={c.id} className="card card-hover overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-brand-600 to-ink-900 text-white p-5 relative">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative flex items-start justify-between">
                <span className="w-11 h-11 rounded-xl bg-white/15 inline-flex items-center justify-center">
                  <Icon name="gift" />
                </span>
                <span className="font-display font-700 text-3xl tabnum">−{discount}</span>
              </div>
              <p className="relative mt-3 text-sm text-white/90 leading-snug">{c.description}</p>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex flex-wrap gap-2 text-xs">
                <Chip className="bg-sky-100 text-ink-600">{t("forProducts", { products })}</Chip>
                {c.minSpend && (
                  <Chip className="bg-ink-50 text-ink-500">
                    {t("minSpend", { amount: baht(c.minSpend) })}
                  </Chip>
                )}
              </div>
              {c.paymentCondition && (
                <p className="mt-3 text-xs text-ink-500 flex items-center gap-1.5">
                  <Icon name="creditcard" size={13} /> {c.paymentCondition}
                </p>
              )}
              <p className="mt-3 text-xs text-ink-400">{t("expires", { date: c.expiry })}</p>

              <div className="mt-auto pt-4 flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-dashed border-brand-300 bg-brand-50 px-3 py-2 text-center font-700 text-brand-700 tracking-wide">
                  {c.code}
                </code>
                <Button variant="primary" size="md" type="button" onClick={() => copy(c.code)}>
                  {copied === c.code ? (
                    <><Icon name="check" size={15} /> {t("copied")}</>
                  ) : (
                    <><Icon name="copy" size={15} /> {t("copy")}</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
