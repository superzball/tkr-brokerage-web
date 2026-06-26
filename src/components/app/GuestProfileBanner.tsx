// src/components/app/GuestProfileBanner.tsx
// Slim, dismissible banner shown to a `guest` account in the portal: nudges them
// to complete their profile (→ Settings) without ever hard-blocking features.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

export function GuestProfileBanner() {
  const t = useTranslations("guest.banner");
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="bg-gradient-to-r from-gold-400 to-gold-300 text-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 text-sm">
        <Icon name="user" size={16} className="shrink-0" />
        <span className="flex-1 font-500">{t("text")}</span>
        <Link
          href="/app/settings"
          className="font-700 underline underline-offset-2 hover:opacity-80 shrink-0"
        >
          {t("cta")}
        </Link>
        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label={t("dismiss")}
          className="shrink-0 w-7 h-7 rounded-lg hover:bg-ink-900/10 flex items-center justify-center"
        >
          <Icon name="x" size={15} />
        </button>
      </div>
    </div>
  );
}
