// src/components/layout/NavRouteGuard.tsx
// Route-level companion to NAV_VISIBILITY. When a nav entry is turned off AND its
// `closedBehavior` is 'blockRoute', its target page is gated with a friendly
// "not available" panel instead of a raw 404 — routing for open items is never
// touched. Client-only; reads the same merged settings the Navbar does, so it
// hides nothing until overrides hydrate after mount.

"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useRouteBlocked } from "@/hooks/useNavVisibility";

export function NavRouteGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("topnav");
  const pathname = usePathname();
  const blocked = useRouteBlocked(pathname);

  if (!blocked) return <>{children}</>;

  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <span className="inline-flex w-16 h-16 rounded-2xl bg-sky-100 text-brand-600 items-center justify-center">
        <Icon name="info" size={30} />
      </span>
      <h1 className="mt-6 text-2xl font-800 text-ink-900">{t("unavailableTitle")}</h1>
      <p className="mt-2 text-ink-500">{t("unavailableBody")}</p>
      <div className="mt-8">
        <Button href="/" variant="primary" size="md">
          {t("backHome")}
          <Icon name="arrowRight" size={18} />
        </Button>
      </div>
    </main>
  );
}
