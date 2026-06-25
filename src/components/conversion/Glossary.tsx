// src/components/conversion/Glossary.tsx
// Plain-language layer: a toggle + glossary tooltips on insurance jargon.
// <PlainLanguageProvider> holds the "อ่านแบบเข้าใจง่าย" state; <GlossaryTip>
// underlines a term and reveals its plain-Thai explanation (always on hover/tap,
// and inline when plain-language mode is on). Glossary copy comes from the mock
// store so admins could manage it later.

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { glossary } from "@/lib/mock/seed";

const PlainCtx = createContext<{ plain: boolean; toggle: () => void }>({
  plain: false,
  toggle: () => {},
});

export function PlainLanguageProvider({ children }: { children: ReactNode }) {
  const [plain, setPlain] = useState(false);
  return (
    <PlainCtx.Provider value={{ plain, toggle: () => setPlain((p) => !p) }}>
      {children}
    </PlainCtx.Provider>
  );
}

export function PlainLanguageToggle({ className }: { className?: string }) {
  const t = useTranslations("conversion.glossary");
  const { plain, toggle } = useContext(PlainCtx);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={plain}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-600 transition-colors",
        plain
          ? "bg-brand-500 text-white border-brand-500"
          : "bg-white text-ink-600 border-ink-200 hover:border-brand-300",
        className,
      )}
    >
      <Icon name="eye" size={15} />
      {t("toggle")}
    </button>
  );
}

function plainFor(term: string): string | undefined {
  return glossary.find((g) => g.term === term)?.plain;
}

/** Self-contained plain-language card for product pages: own provider + toggle +
 *  the glossary terms (each a GlossaryTip). Drop one onto any landing page. */
export function GlossarySection({ className }: { className?: string }) {
  const t = useTranslations("conversion.glossary");
  return (
    <PlainLanguageProvider>
      <div className={cn("card p-6", className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-700 text-xl text-ink-900 flex items-center gap-2">
              <span className="text-brand-600"><Icon name="info" size={18} /></span>
              {t("toggle")}
            </h3>
            <p className="mt-1 text-sm text-ink-500">{t("hint")}</p>
          </div>
          <PlainLanguageToggle />
        </div>
        <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-ink-700">
          {glossary.map((g) => (
            <li key={g.term} className="flex items-start gap-2">
              <span className="text-emerald-500 shrink-0 mt-0.5"><Icon name="check" size={15} /></span>
              <GlossaryTip term={g.term} />
            </li>
          ))}
        </ul>
      </div>
    </PlainLanguageProvider>
  );
}

/** Underlined jargon term with a plain-Thai explanation on hover/tap. */
export function GlossaryTip({ term }: { term: string }) {
  const plainText = plainFor(term);
  const { plain } = useContext(PlainCtx);
  if (!plainText) return <>{term}</>;

  return (
    <span className="group/gloss relative inline-flex items-center gap-0.5">
      <span className="underline decoration-dotted decoration-ink-300 underline-offset-2 cursor-help">
        {term}
      </span>
      <span className="text-ink-300 group-hover/gloss:text-brand-500">
        <Icon name="info" size={12} />
      </span>
      {/* hover/focus tooltip */}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-1 w-56 rounded-xl bg-ink-900 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover/gloss:opacity-100"
      >
        {plainText}
      </span>
      {plain && (
        <span className="ml-1 text-xs font-400 text-brand-600">— {plainText}</span>
      )}
    </span>
  );
}
