// src/components/legal/ConsentFields.tsx
// Reusable PDPA consent capture (Phase 21) for signup + guest checkout. The
// service consent is required to proceed (links to the privacy policy + terms);
// the marketing opt-in is separate and optional. Controlled by the parent, which
// writes the auditable ConsentRecords on submit.

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function ConsentFields({
  pdpa,
  marketing,
  onPdpa,
  onMarketing,
  error,
}: {
  pdpa: boolean;
  marketing: boolean;
  onPdpa: (v: boolean) => void;
  onMarketing: (v: boolean) => void;
  /** Highlight the required box when the user tried to submit without it. */
  error?: boolean;
}) {
  const t = useTranslations("consent.capture");

  return (
    <div className="space-y-2.5">
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={pdpa}
          onChange={(e) => onPdpa(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-brand-500 shrink-0"
          aria-invalid={error && !pdpa}
        />
        <span className={cn("text-sm leading-relaxed", error && !pdpa ? "text-rose-600" : "text-ink-600")}>
          {t.rich("pdpa", {
            privacy: (c) => (
              <Link href="/legal/privacy" target="_blank" className="font-600 text-brand-600 hover:underline">
                {c}
              </Link>
            ),
            terms: (c) => (
              <Link href="/legal/terms" target="_blank" className="font-600 text-brand-600 hover:underline">
                {c}
              </Link>
            ),
          })}
          <span className="text-rose-500"> *</span>
        </span>
      </label>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={marketing}
          onChange={(e) => onMarketing(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-brand-500 shrink-0"
        />
        <span className="text-sm leading-relaxed text-ink-600">{t("marketing")}</span>
      </label>
    </div>
  );
}
