// src/components/legal/CookieConsent.tsx
// Site-wide cookie-consent banner (Phase 21). First visit shows a bar with
// Accept all / Reject non-essential / Manage. "Manage" opens a category sheet
// (essential always-on, analytics + marketing opt-in). The choice persists in a
// first-party cookie and writes auditable ConsentRecords; analytics/marketing
// scripts stay gated (see ConsentScripts) until consented. Reopen from the
// footer's "จัดการคุกกี้" link via the COOKIE_PREFS_EVENT.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import {
  COOKIE_PREFS_EVENT,
  readCookieChoice,
  writeCookieChoice,
  type CookieChoice,
} from "@/lib/legal/cookies";
import { recordConsents, visitorId } from "@/lib/legal/consent";

export function CookieConsent({ cookieVersion }: { cookieVersion: string }) {
  const t = useTranslations("consent.cookie");
  const [mounted, setMounted] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Decide visibility after mount (avoids SSR/cookie hydration mismatch).
  useEffect(() => {
    setMounted(true);
    const choice = readCookieChoice();
    if (choice) {
      setAnalytics(choice.analytics);
      setMarketing(choice.marketing);
    } else {
      setShowBar(true);
    }
    const reopen = () => {
      const c = readCookieChoice();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setShowManager(true);
    };
    window.addEventListener(COOKIE_PREFS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_PREFS_EVENT, reopen);
  }, []);

  function persist(a: boolean, m: boolean) {
    const choice: CookieChoice = {
      v: cookieVersion,
      analytics: a,
      marketing: m,
      ts: new Date().toISOString(),
    };
    writeCookieChoice(choice);
    recordConsents([
      { subjectId: visitorId(), type: "cookies_analytics", granted: a, policyVersion: cookieVersion, source: "cookie_banner" },
      { subjectId: visitorId(), type: "cookies_marketing", granted: m, policyVersion: cookieVersion, source: "cookie_banner" },
    ]);
    setAnalytics(a);
    setMarketing(m);
    setShowBar(false);
    setShowManager(false);
  }

  if (!mounted || (!showBar && !showManager)) return null;

  return (
    <>
      {/* First-visit bar (hidden while the manager sheet is open) */}
      {showBar && !showManager && (
        <div className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4">
          <div className="mx-auto max-w-5xl card shadow-pop border border-ink-100 p-5 sm:flex sm:items-center sm:gap-5">
            <div className="flex-1">
              <p className="font-700 text-ink-900 flex items-center gap-2">
                <span className="text-brand-600"><Icon name="shield" size={18} /></span>
                {t("title")}
              </p>
              <p className="mt-1 text-sm text-ink-600 leading-relaxed">
                {t("desc")}{" "}
                <Link href="/legal/cookies" className="font-600 text-brand-600 hover:underline">
                  {t("cookieLink")}
                </Link>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowManager(true)}
                className="btn btn-ghost btn-md"
              >
                {t("manage")}
              </button>
              <button
                type="button"
                onClick={() => persist(false, false)}
                className="btn btn-ghost btn-md"
              >
                {t("reject")}
              </button>
              <Button variant="primary" size="md" onClick={() => persist(true, true)}>
                {t("acceptAll")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category manager sheet */}
      {showManager && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
            onClick={() => setShowManager(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("managerTitle")}
            className="relative card shadow-pop w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-display font-700 text-xl text-ink-900">{t("managerTitle")}</h2>
            <p className="mt-1 text-sm text-ink-500">{t("managerDesc")}</p>

            <div className="mt-5 space-y-3">
              <CategoryRow
                title={t("cat.essential")}
                desc={t("cat.essentialDesc")}
                checked
                disabled
                alwaysOn={t("alwaysOn")}
              />
              <CategoryRow
                title={t("cat.analytics")}
                desc={t("cat.analyticsDesc")}
                checked={analytics}
                onChange={setAnalytics}
              />
              <CategoryRow
                title={t("cat.marketing")}
                desc={t("cat.marketingDesc")}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => persist(false, false)}
                className="btn btn-ghost btn-md"
              >
                {t("reject")}
              </button>
              <Button variant="primary" size="md" onClick={() => persist(analytics, marketing)}>
                {t("save")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryRow({
  title,
  desc,
  checked,
  disabled,
  alwaysOn,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  alwaysOn?: string;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-ink-100 p-4">
      <div className="min-w-0">
        <p className="font-600 text-ink-900">{title}</p>
        <p className="mt-0.5 text-sm text-ink-500 leading-relaxed">{desc}</p>
      </div>
      {disabled ? (
        <span className="shrink-0 text-xs font-600 text-mint-600 inline-flex items-center gap-1">
          <Icon name="check" size={14} /> {alwaysOn}
        </span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          onClick={() => onChange?.(!checked)}
          className={cn(
            "shrink-0 relative w-11 h-6 rounded-full transition-colors",
            checked ? "bg-brand-500" : "bg-ink-200",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
              checked && "translate-x-5",
            )}
          />
        </button>
      )}
    </div>
  );
}
