"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PAYMENT_METHODS } from "@/config/insurance";
import {
  PENDING_QUOTE_COOKIE,
  encodePendingQuote,
  type PendingQuote,
} from "@/lib/quote/pending";
import type { PaymentMethodId } from "@/types";

export function PayStep({
  total,
  authed,
  pending,
  onPaid,
}: {
  total: number;
  /** Anonymous visitors are gated to sign in / up before completing. */
  authed: boolean;
  pending: PendingQuote;
  onPaid: () => void;
}) {
  const t = useTranslations("worker");
  const tc = useTranslations("checkout");
  const baht = useBaht();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethodId>("promptpay");

  function stash() {
    document.cookie = `${PENDING_QUOTE_COOKIE}=${encodePendingQuote(pending)}; path=/; max-age=1800; samesite=lax`;
  }

  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-700 text-2xl text-ink-900">
        {t("pay.heading")}
      </h2>
      <p className="text-ink-600 mt-1.5">{t("pay.sub")}</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn("seg", method === m.id && "is-on")}
          >
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center">
              <Icon name={m.icon} />
            </span>
            <p className="font-600 text-ink-900 mt-3">{t(`pay.methods.${m.id}`)}</p>
          </button>
        ))}
      </div>

      <div className="card mt-5 p-6 text-center">
        <p className="text-sm text-ink-500">{t("pay.amountLabel")}</p>
        <p className="font-display font-700 text-4xl text-brand-700 mt-1 tabnum">
          {baht(total)}
        </p>
        <div className="mt-5 inline-flex p-4 rounded-2xl bg-white border border-ink-100 shadow-card">
          <div
            className="w-40 h-40 rounded-lg"
            style={{
              backgroundColor: "#0b2240",
              backgroundImage: "radial-gradient(#fff 30%, transparent 31%)",
              backgroundSize: "14px 14px",
            }}
          />
        </div>
        <p className="mt-4 text-sm text-ink-500">{t("pay.qrHint")}</p>

        {authed ? (
          <Button variant="primary" size="lg" className="mt-5" onClick={onPaid}>
            {t("pay.confirm")} <Icon name="arrowRight" />
          </Button>
        ) : (
          // Quote-before-login: gate the purchase, stashing the quote first.
          <div className="mt-6 rounded-2xl border border-brand-100 bg-sky-50/70 p-5 text-left">
            <p className="font-600 text-ink-900 flex items-center gap-2">
              <span className="text-brand-600"><Icon name="lock" size={18} /></span>
              {tc("gate.title")}
            </p>
            <p className="mt-1 text-sm text-ink-600">{tc("gate.desc")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  stash();
                  router.push("/signup?role=business");
                }}
              >
                {tc("gate.signup")} <Icon name="arrowRight" />
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  stash();
                  router.push("/login?next=/app/checkout");
                }}
              >
                {tc("gate.login")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
