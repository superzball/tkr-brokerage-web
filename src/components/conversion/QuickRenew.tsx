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
        "bg-gradient-to-r from-gold-400 via-gold-400 to-peach-400 shadow-glow",
        className,
      )}
    >
      {/* offset decoration */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div
        className="absolute -top-16 -right-10 w-64 h-64 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle,rgba(255,255,255,.45),transparent 70%)" }}
      />
      <div className="relative flex items-start gap-4">
        <span className="w-12 h-12 rounded-2xl bg-white/35 text-ink-900 inline-flex items-center justify-center shrink-0">
          <Icon name="refresh" size={22} />
        </span>
        <div>
          <h3 className="font-display font-700 text-2xl text-ink-900">{t("title")}</h3>
          <p className="mt-1 text-[0.95rem] text-ink-800/80">{t("sub")}</p>
        </div>
      </div>
      <Button href={RENEW_HREF} variant="ghost" size="lg" className="relative shrink-0">
        {t("cta")} <Icon name="arrowRight" />
      </Button>
    </div>
  );
}
