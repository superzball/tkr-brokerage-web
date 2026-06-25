// src/components/conversion/TrustCredentials.tsx
// Honest trust section: OIC broker license + real partner-insurer logo wall +
// verifiable stats. No fabricated awards — the awards slot stays empty until
// real ones exist (project guiding principle #5).

import { useTranslations, useFormatter } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { insurerPartners, trustStats } from "@/lib/mock/seed";

export function TrustCredentials() {
  const t = useTranslations("conversion.trust");
  const format = useFormatter();

  return (
    <section className="bg-ink-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display font-700 text-3xl sm:text-4xl tracking-tight text-center mb-10">
          {t("title")}
        </h2>

        {/* stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <span className="w-11 h-11 rounded-xl bg-white/10 text-brand-300 inline-flex items-center justify-center mb-3">
              <Icon name="shieldCheck" />
            </span>
            <p className="font-600 text-white">{t("oicTitle")}</p>
            <p className="mt-1 text-sm text-ink-300">{trustStats.oicLicense}</p>
          </div>
          <div>
            <p className="font-display font-700 text-4xl text-white tabnum">
              {trustStats.insurers}<span className="text-brand-400">+</span>
            </p>
            <p className="mt-2 text-ink-300">{t("insurersTitle")}</p>
          </div>
          <div>
            <p className="font-display font-700 text-4xl text-white tabnum">
              {format.number(trustStats.customersServed)}<span className="text-brand-400">+</span>
            </p>
            <p className="mt-2 text-ink-300">{t("customersTitle")}</p>
          </div>
          <div>
            <p className="font-display font-700 text-4xl text-white tabnum">
              {trustStats.claimsPaidPct}<span className="text-brand-400">%</span>
            </p>
            <p className="mt-2 text-ink-300">{t("claimsTitle")}</p>
          </div>
        </div>

        {/* partner wall */}
        <div className="mt-14 pt-10 border-t border-ink-800">
          <p className="text-center text-sm text-ink-400 mb-7">{t("partnersTitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {insurerPartners.map((p) => (
              <span key={p.id} className="font-display font-700 text-xl text-ink-200/80">
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* awards — intentionally empty until real awards exist */}
        <div className="mt-12">
          <p className="text-center text-sm text-ink-400 mb-4">{t("awardsTitle")}</p>
          <div className="rounded-2xl border border-dashed border-ink-700 p-6 text-center text-sm text-ink-500 max-w-2xl mx-auto">
            {t("awardsEmpty")}
          </div>
        </div>
      </div>
    </section>
  );
}
