"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

// Lazy: confetti JS ships only when the success step renders.
const Confetti = dynamic(
  () => import("@/components/ui/Confetti").then((m) => m.Confetti),
  { ssr: false },
);

export function DoneStep({ count }: { count: number }) {
  const t = useTranslations("worker");

  return (
    <div className="animate-fade-up text-center py-6">
      <Confetti />
      <span className="w-20 h-20 rounded-full bg-mint-50 text-mint-500 inline-flex items-center justify-center mx-auto">
        <Icon name="checkCircle" size={44} />
      </span>
      <h2 className="font-display font-700 text-2xl text-ink-900 mt-5">
        {t("done.heading")}
      </h2>
      <p className="text-ink-600 mt-2 max-w-md mx-auto">
        {t("done.desc", { n: count })}
      </p>
      <div className="mt-3 inline-flex items-center gap-2 chip bg-sky-100 text-brand-700">
        {t("done.orderNo")} <span className="font-700">{t("done.orderNoValue")}</span>
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button href={ROUTES.tracking} variant="primary" size="lg">
          {t("done.track")} <Icon name="arrowRight" />
        </Button>
        <Button href={ROUTES.customer} variant="ghost" size="lg">
          {t("done.toCustomer")}
        </Button>
      </div>
    </div>
  );
}
