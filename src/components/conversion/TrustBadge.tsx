// src/components/conversion/TrustBadge.tsx
// Privacy-first trust badge shown near every quote entry: "see a real price with
// no personal data, no sales calls." Isomorphic (next-intl hooks work in RSC).

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function TrustBadge({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "block";
  className?: string;
}) {
  const t = useTranslations("conversion.trustBadge");

  if (variant === "block") {
    return (
      <div
        className={cn(
          "rounded-xl bg-mint-50 border border-mint-100 p-3.5 flex items-start gap-2.5",
          className,
        )}
      >
        <span className="text-mint-600 shrink-0 mt-0.5">
          <Icon name="shieldCheck" size={18} />
        </span>
        <div className="text-sm">
          <p className="font-600 text-mint-600">{t("title")}</p>
          <p className="text-mint-600/80 mt-0.5">{t("noData")} · {t("noCall")}</p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-mint-50 text-mint-600 border border-mint-100 px-3 py-1 text-xs font-600",
        className,
      )}
    >
      <Icon name="shieldCheck" size={14} />
      {t("title")}
    </span>
  );
}
