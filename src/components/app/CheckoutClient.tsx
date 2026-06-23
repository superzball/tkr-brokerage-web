"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useBaht } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/app/EmptyState";
import { clearPendingQuote } from "@/lib/quote/actions";
import type { PendingQuote } from "@/lib/quote/pending";

export function CheckoutClient({ quote }: { quote: PendingQuote | null }) {
  const t = useTranslations("checkout.page");
  const baht = useBaht();
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

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
        <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
          <Icon name="checkCircle" size={36} />
        </span>
        <h2 className="text-xl font-700 text-ink-900">{t("confirmedTitle")}</h2>
        <p className="mt-1.5 text-sm text-ink-500 max-w-sm">{t("confirmedDesc")}</p>
        <Button href="/app/policies" variant="primary" size="md" className="mt-5">
          {t("viewPolicies")} <Icon name="arrowRight" />
        </Button>
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
        <div className="h-px bg-ink-100 my-1" />
        <div className="flex justify-between items-center gap-4">
          <dt className="text-ink-600 font-500">{t("total")}</dt>
          <dd className="font-700 text-2xl text-brand-700 tabnum">{baht(quote.total)}</dd>
        </div>
      </dl>
      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6"
        disabled={pending}
        onClick={() => start(async () => {
          await clearPendingQuote();
          setDone(true);
        })}
      >
        {t("confirm")} <Icon name="arrowRight" />
      </Button>
    </div>
  );
}
