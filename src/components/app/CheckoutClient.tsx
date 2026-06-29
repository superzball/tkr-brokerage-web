"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

// Lazy: confetti JS ships only when the confirmation renders.
const Confetti = dynamic(
  () => import("@/components/ui/Confetti").then((m) => m.Confetti),
  { ssr: false },
);
import { EmptyState } from "@/components/app/EmptyState";
import { ProgressiveProfile } from "@/components/guest/ProgressiveProfile";
import { useSession } from "@/lib/auth/SessionProvider";
import { clearPendingQuote } from "@/lib/quote/actions";
import { readPendingDetail, clearPendingDetail, type PendingDetail } from "@/lib/quote/local";
import type { PendingQuote } from "@/lib/quote/pending";
import { CouponInstallment } from "@/components/conversion/CouponInstallment";
import { ChannelChoice } from "@/components/conversion/ChannelChoice";
import { PaymentMethods } from "@/components/conversion/PaymentMethods";
import { GuestVerify } from "@/components/worker/GuestVerify";
import { recordEarn } from "@/lib/loyalty/local";
import type { InsuranceType } from "@/types/portal";

export function CheckoutClient({ quote }: { quote: PendingQuote | null }) {
  const t = useTranslations("checkout.page");
  const tw = useTranslations("worker");
  const tl = useTranslations("loyalty");
  const user = useSession();
  const [done, setDone] = useState(false);
  const [earnedPts, setEarnedPts] = useState(0);
  const [pending, start] = useTransition();
  // Channel choice (ซื้อเอง / ตัวแทน) gates the self-serve payment panel — Phase 17/18.
  const [selfServe, setSelfServe] = useState(false);
  // Guest checkout: a silent guest session must verify/resume its phone before
  // payment too (never skip identity just because a session cookie exists). A
  // full account is already identified and goes straight to payment.
  const isFullAccount = user.status !== "guest";
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const showPayment = isFullAccount || verifiedPhone !== null;

  // The full worker rows ride in localStorage — rehydrate after the sign-in hop.
  const [detail, setDetail] = useState<PendingDetail | null>(null);
  useEffect(() => setDetail(readPendingDetail()), []);
  const workers = detail?.workers ?? [];

  if (!quote) {
    return (
      <EmptyState
        icon="box"
        title={t("emptyTitle")}
        body={t("emptyDesc")}
        action={
          <Button href="/insurance/worker" variant="primary" size="md">
            {t("emptyCta")}
          </Button>
        }
      />
    );
  }

  if (done) {
    return (
      <div className="card p-10 flex flex-col items-center text-center">
        <Confetti />
        <span className="w-16 h-16 rounded-full bg-mint-50 text-mint-500 flex items-center justify-center mb-4">
          <Icon name="checkCircle" size={36} />
        </span>
        <h2 className="text-xl font-700 text-ink-900">{t("confirmedTitle")}</h2>
        <p className="mt-1.5 text-sm text-ink-500 max-w-sm">{t("confirmedDesc")}</p>
        {earnedPts > 0 && (
          <p className="mt-3 inline-flex items-center gap-1.5 chip bg-gold-50 text-gold-600 text-sm font-600">
            <Icon name="gift" size={15} /> {tl("checkoutEarn", { n: earnedPts })}
          </p>
        )}
        <Button href="/app/policies" variant="primary" size="md" className="mt-5">
          {t("viewPolicies")} <Icon name="arrowRight" />
        </Button>
        {user.status === "guest" && (
          <ProgressiveProfile className="mt-7 w-full max-w-md text-left" />
        )}
      </div>
    );
  }

  return (
    <div className="card p-6 max-w-lg">
      <h2 className="font-700 text-ink-900 mb-4">{t("summaryTitle")}</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">{t("plan")}</dt>
          <dd className="font-600 text-ink-900">{quote.planLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">{t("workers")}</dt>
          <dd className="font-600 text-ink-900 tabnum">{quote.count}</dd>
        </div>
      </dl>

      {/* channel choice (ซื้อเอง / ตัวแทน) — keep the agent path (Phase 17) */}
      {!selfServe ? (
        <div className="mt-5 pt-5 border-t border-ink-100">
          <ChannelChoice onSelf={() => setSelfServe(true)} />
        </div>
      ) : !showPayment ? (
        // Guest session: verify (or resume) the phone before payment. Re-verifying
        // an existing phone resumes that guest via findOrCreateGuestByPhone — no
        // duplicate account, no forced re-registration.
        <div className="mt-5 pt-5 border-t border-ink-100">
          <GuestVerify onVerified={(phone) => setVerifiedPhone(phone)} />
        </div>
      ) : (
        <>
          {/* coupon + installment selector */}
          <div className="mt-5 pt-5 border-t border-ink-100">
            <CouponInstallment
              product={quote.product as InsuranceType}
              subtotal={quote.total}
            />
          </div>

          {/* payment method + instant-coverage note */}
          <div className="mt-5 pt-5 border-t border-ink-100">
            <PaymentMethods />
          </div>
        </>
      )}

      {workers.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-600 text-ink-700 mb-2">{t("workersList")}</p>
          <ul className="rounded-xl border border-ink-100 divide-y divide-ink-50 text-sm">
            {workers.map((w, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="font-500 text-ink-900 truncate">
                  {[w.title, w.name].filter(Boolean).join(" ") || "—"}
                </span>
                <span className="shrink-0 text-ink-400 tabnum">
                  {w.passport || "—"} · {tw(`nat.${w.nat}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selfServe && showPayment && (
        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          disabled={pending}
          onClick={() => start(async () => {
            await clearPendingQuote();
            clearPendingDetail();
            // Loyalty earn hook (mock): 1 point per ฿100 of premium on purchase.
            const pts = Math.floor((quote.total ?? 0) / 100);
            if (pts > 0) {
              recordEarn({
                source: "purchase",
                points: pts,
                description: tl("earn.earnPurchase"),
                ref: quote.planLabel,
              });
              setEarnedPts(pts);
            }
            setDone(true);
          })}
        >
          {t("confirm")} <Icon name="arrowRight" />
        </Button>
      )}
    </div>
  );
}
