// src/components/conversion/QuickRenew.tsx
// Public "ต่อประกันลูกค้าเดิม" entry. Links into the authenticated renew flow
// (/app/buy); the (app) route guard sends anonymous visitors to /login?next=…
// first, so a logged-in customer goes straight to renew and others log in.

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const RENEW_HREF = "/app/buy?intent=renew";

export function QuickRenew({ className }: { className?: string }) {
  const t = useTranslations("conversion.quickRenew");
  return (
    <div
      className={cn(
        "card card-lg p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="w-12 h-12 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
          <Icon name="refresh" size={22} />
        </span>
        <div>
          <h3 className="font-display font-700 text-xl text-ink-900">{t("title")}</h3>
          <p className="mt-1 text-sm text-ink-600">{t("sub")}</p>
        </div>
      </div>
      <Button href={RENEW_HREF} variant="primary" size="lg" className="shrink-0">
        {t("cta")} <Icon name="arrowRight" />
      </Button>
    </div>
  );
}
