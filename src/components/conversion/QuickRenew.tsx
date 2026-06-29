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
        "relative overflow-hidden rounded-[1.75rem] p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-5 justify-between",
        "bg-white border border-ink-100",
        className,
      )}
    >
      {/* slim gold precision accent on the leading edge — a single sparing highlight */}
      <span
        className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold-400 to-gold-500"
        aria-hidden="true"
      />
      <div className="relative flex items-start gap-4">
        <span className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
          <Icon name="refresh" size={22} />
        </span>
        <div>
          <h3 className="font-display font-700 text-2xl text-ink-900">{t("title")}</h3>
          <p className="mt-1 text-[0.95rem] text-ink-600">{t("sub")}</p>
        </div>
      </div>
      <Button href={RENEW_HREF} variant="primary" size="lg" className="relative shrink-0">
        {t("cta")} <Icon name="arrowRight" />
      </Button>
    </div>
  );
}
