// src/components/legal/ConsentScripts.tsx
// Script gate (Phase 21). Analytics + marketing tags must NOT load until the
// visitor consents via the cookie banner. This mounts the gated tags only when
// the matching cookie category is granted, and re-evaluates live when the choice
// changes. Mock: the real <Script> tags (GA / Meta Pixel / LINE Tag) drop in
// where the markers are — they inherit the same gating, so nothing leaks before
// consent.

"use client";

import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, readCookieChoice } from "@/lib/legal/cookies";

export function ConsentScripts() {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const sync = () => {
      const c = readCookieChoice();
      setAnalytics(Boolean(c?.analytics));
      setMarketing(Boolean(c?.marketing));
    };
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  return (
    <>
      {analytics && (
        // <Script src="https://www.googletagmanager.com/gtag/js?id=…" /> goes here
        <span data-consent-script="analytics" hidden aria-hidden="true" />
      )}
      {marketing && (
        // <Script src="https://connect.facebook.net/…/fbevents.js" /> goes here
        <span data-consent-script="marketing" hidden aria-hidden="true" />
      )}
    </>
  );
}
