// src/components/legal/ManageCookiesLink.tsx
// "จัดการคุกกี้" — reopens the cookie preferences manager from anywhere (footer,
// cookie policy page) by broadcasting the event CookieConsent listens for.

"use client";

import { useTranslations } from "next-intl";
import { COOKIE_PREFS_EVENT } from "@/lib/legal/cookies";

export function ManageCookiesLink({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations("consent.cookie");
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(COOKIE_PREFS_EVENT))}
    >
      {children ?? t("manageLink")}
    </button>
  );
}
