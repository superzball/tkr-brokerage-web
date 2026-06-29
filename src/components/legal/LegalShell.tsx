// src/components/legal/LegalShell.tsx
// Shared shell for the public legal pages (privacy/terms/cookies/consent).
// Friendly-zone hero + a standing "legal review" notice (the wording is a
// placeholder until counsel approves) + version/effective-date meta + a sub-nav
// between the legal docs + a DPO contact block. Body content is passed as
// children so each page supplies its own (CMS/i18n-sourced) sections.

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

type LegalKey = "privacy" | "terms" | "cookies" | "consent";

const NAV: { key: LegalKey; href: string }[] = [
  { key: "privacy", href: "/legal/privacy" },
  { key: "terms", href: "/legal/terms" },
  { key: "cookies", href: "/legal/cookies" },
  { key: "consent", href: "/legal/consent" },
];

export async function LegalShell({
  active,
  title,
  version,
  effectiveDate,
  updatedAt,
  children,
}: {
  active: LegalKey;
  title: string;
  version?: string;
  effectiveDate?: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations("legal");

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="shield" size={15} /> {t("badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500 tabnum">
            {version && <span>{t("version")} {version}</span>}
            {effectiveDate && <span>· {t("effective")} {effectiveDate}</span>}
            {updatedAt && <span>· {t("lastUpdated")} {updatedAt}</span>}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid gap-10 lg:grid-cols-[200px_1fr]">
        {/* sub-nav */}
        <nav className="lg:sticky lg:top-24 h-max">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <li key={n.key}>
                <Link
                  href={n.href}
                  aria-current={active === n.key ? "page" : undefined}
                  className={
                    "block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-600 transition-colors " +
                    (active === n.key
                      ? "bg-brand-500 text-white"
                      : "text-ink-600 hover:bg-sky-50 hover:text-brand-700")
                  }
                >
                  {t(`nav.${n.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* body */}
        <div>
          {/* standing legal-review notice */}
          <div className="flex items-start gap-3 rounded-xl bg-gold-50 border border-gold-100 px-4 py-3 text-sm text-gold-700">
            <span className="mt-0.5 shrink-0"><Icon name="info" size={16} /></span>
            <p>{t("reviewTodo")}</p>
          </div>

          <div className="mt-8 space-y-7">{children}</div>

          {/* DPO contact */}
          <div className="mt-10 card p-6">
            <h2 className="font-700 text-ink-900 flex items-center gap-2">
              <span className="text-brand-600"><Icon name="headset" size={18} /></span>
              {t("dpo.title")}
            </h2>
            <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{t("dpo.desc")}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <a href="mailto:dpo@tkr.co.th" className="font-600 text-brand-600 hover:underline inline-flex items-center gap-1.5">
                <Icon name="phone" size={15} /> {t("dpo.email")}
              </a>
              <Link href="/legal/data-request" className="font-600 text-brand-600 hover:underline inline-flex items-center gap-1.5">
                <Icon name="clipboard" size={15} /> {t("dpo.dsrCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Render an i18n `sections` array: each item = { h, b: string[] }. */
export function LegalSections({ sections }: { sections: { h: string; b: string[] }[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <section key={i}>
          <h2 className="font-display font-700 text-xl text-ink-900">{s.h}</h2>
          <div className="mt-2 space-y-3 text-ink-600 leading-relaxed">
            {s.b.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
