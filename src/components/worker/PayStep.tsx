"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PAYMENT_METHODS } from "@/config/insurance";
import { GuestVerify } from "./GuestVerify";
import { ChannelChoice } from "@/components/conversion/ChannelChoice";
import { CouponInstallment, type CouponInstallmentState } from "@/components/conversion/CouponInstallment";
import {
  PENDING_QUOTE_COOKIE,
  encodePendingQuote,
  type PendingQuote,
} from "@/lib/quote/pending";
import { savePendingDetail } from "@/lib/quote/local";
import type { PaymentMethodId, SingleWorker } from "@/types";

export function PayStep({
  total,
  authed,
  pending,
  workers = [],
  onPaid,
}: {
  total: number;
  /** Anonymous visitors are gated to sign in / up before completing. */
  authed: boolean;
  pending: PendingQuote;
  /** Single-mode worker rows, stashed so they survive the sign-in detour. */
  workers?: SingleWorker[];
  onPaid: () => void;
}) {
  const t = useTranslations("worker");
  const tc = useTranslations("checkout");
  const ti = useTranslations("conversion.installment");
  const baht = useBaht();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethodId>("promptpay");
  // Guest checkout: phone verified via OTP unlocks payment without forcing signup.
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  // Channel choice (TKR's edge): self-serve vs hand off to an agent.
  const [selfServe, setSelfServe] = useState(false);
  // Coupon + installment, applied to the worker subtotal.
  const [ci, setCi] = useState<CouponInstallmentState>({ code: null, discount: 0, total, months: 0 });

  function stash() {
    document.cookie = `${PENDING_QUOTE_COOKIE}=${encodePendingQuote(pending)}; path=/; max-age=1800; samesite=lax`;
    savePendingDetail({ workers });
  }

  // Step 1 — channel choice. The agent path is fully handled inside the component.
  if (!selfServe) {
    return (
      <div className="animate-fade-up">
        <h2 className="font-display font-700 text-2xl text-ink-900">{t("pay.heading")}</h2>
        <ChannelChoice className="mt-5" onSelf={() => setSelfServe(true)} />
      </div>
    );
  }

  // Step 2 — guests verify their phone (captures contact, no forced signup), then pay.
  const showPayment = authed || verifiedPhone !== null;

  return (
    <div className="animate-fade-up">
      <h2 className="font-display font-700 text-2xl text-ink-900">
        {t("pay.heading")}
      </h2>
      {showPayment && <p className="text-ink-600 mt-1.5">{t("pay.sub")}</p>}

      {!showPayment ? (
        // Returning users can still sign in — that path stashes the quote first.
        <GuestVerify
          onVerified={setVerifiedPhone}
          onLogin={() => {
            stash();
            router.push("/login?next=/app/checkout");
          }}
        />
      ) : (
        <>
          {verifiedPhone && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-600 text-mint-600">
              <Icon name="checkCircle" size={16} />
              {tc("verify.verifiedNote", { phone: verifiedPhone })}
            </p>
          )}

          {/* coupon + installment */}
          <div className="card mt-6 p-5">
            <CouponInstallment product="worker" subtotal={total} onChange={setCi} />
          </div>

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
              {baht(ci.months > 0 ? Math.ceil(ci.total / ci.months) : ci.total)}
              {ci.months > 0 && (
                <span className="text-base font-500 text-ink-400">
                  {" "}× {ti("months", { n: ci.months })}
                </span>
              )}
            </p>
            {ci.months > 0 && (
              <p className="text-xs text-ink-500 mt-1">
                {tc("page.total")}: {baht(ci.total)}
              </p>
            )}
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

            <div>
              <Button variant="primary" size="lg" className="mt-4" onClick={onPaid}>
                {t("pay.confirm")} <Icon name="arrowRight" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
