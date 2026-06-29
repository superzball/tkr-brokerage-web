// src/components/legal/ConsentCenter.tsx
// Logged-in consent center (Phase 21). Shows the subject's current consents and
// lets them grant/withdraw the optional ones. Each change appends a new
// ConsentRecord (never edits history). Seed state is merged with consents
// captured client-side this session. The core service consent (pdpa_service)
// can't be withdrawn while the account is active — withdrawing it means closing
// the account, which routes to a data-subject request instead.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/app/toast";
import { cn } from "@/lib/cn";
import { recordConsent, localConsentState } from "@/lib/legal/consent";
import type { ConsentType } from "@/types/portal";

const MANAGED: { type: ConsentType; locked?: boolean }[] = [
  { type: "pdpa_service", locked: true },
  { type: "marketing" },
  { type: "data_sharing" },
  { type: "cookies_analytics" },
  { type: "cookies_marketing" },
];

export function ConsentCenter({
  subjectId,
  seed,
  policyVersion,
}: {
  subjectId: string;
  seed: Partial<Record<ConsentType, boolean>>;
  policyVersion: string;
}) {
  const t = useTranslations("legal.consent");
  const { toast } = useToast();

  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      MANAGED.map((m) => [m.type, seed[m.type] ?? Boolean(m.locked)]),
    ),
  );

  // Merge consents captured client-side this session on top of the seed.
  useEffect(() => {
    const local = localConsentState(subjectId);
    setState((prev) => {
      const next = { ...prev };
      for (const m of MANAGED) {
        const rec = local[m.type];
        if (rec) next[m.type] = rec.granted;
      }
      return next;
    });
  }, [subjectId]);

  function toggle(type: ConsentType, locked?: boolean) {
    if (locked) return;
    const granted = !state[type];
    setState((s) => ({ ...s, [type]: granted }));
    recordConsent({ subjectId, type, granted, policyVersion, source: "consent_center" });
    toast(granted ? t("grantedToast") : t("withdrawnToast"), "success");
  }

  return (
    <div className="space-y-3">
      {MANAGED.map(({ type, locked }) => {
        const on = state[type];
        return (
          <div
            key={type}
            className="card p-5 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-600 text-ink-900">{t(`types.${type}.label`)}</p>
              <p className="mt-0.5 text-sm text-ink-500 leading-relaxed">
                {t(`types.${type}.desc`)}
              </p>
              {locked && (
                <p className="mt-1.5 text-xs text-ink-400 inline-flex items-center gap-1">
                  <Icon name="lock" size={12} /> {t("requiredNote")}
                </p>
              )}
            </div>
            {locked ? (
              <span className="shrink-0 badge" data-tone="success">
                {t("statusGranted")}
              </span>
            ) : (
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={t(`types.${type}.label`)}
                onClick={() => toggle(type, locked)}
                className={cn(
                  "shrink-0 relative w-11 h-6 rounded-full transition-colors",
                  on ? "bg-brand-500" : "bg-ink-200",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    on && "translate-x-5",
                  )}
                />
              </button>
            )}
          </div>
        );
      })}

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-ink-600">{t("dsrDesc")}</p>
        <Link href="/legal/data-request" className="btn btn-ghost btn-md shrink-0">
          <Icon name="clipboard" size={16} /> {t("dsrCta")}
        </Link>
      </div>
    </div>
  );
}
