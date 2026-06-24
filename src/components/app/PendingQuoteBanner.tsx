"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

/** Top strip shown in the app shell when a quote was stashed before login. */
export function PendingQuoteBanner() {
  const t = useTranslations("checkout.banner");
  const ta = useTranslations("app");
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="bg-brand-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 text-sm">
        <Icon name="sparkle" size={18} className="shrink-0" />
        <span className="flex-1 font-500">{t("title")}</span>
        <Link
          href="/app/checkout"
          className="chip bg-white text-brand-700 font-600 hover:bg-sky-50 shrink-0"
        >
          {t("cta")}
        </Link>
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label={ta("dismiss")}
          className="shrink-0 opacity-80 hover:opacity-100"
        >
          <Icon name="x" size={18} />
        </button>
      </div>
    </div>
  );
}
