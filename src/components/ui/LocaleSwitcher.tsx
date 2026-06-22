"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/** Language endonyms (each shown in its own script). */
const LABELS: Record<Locale, string> = {
  th: "ไทย",
  en: "English",
  my: "မြန်မာ",
  lo: "ລາວ",
};

const SHORT: Record<Locale, string> = {
  th: "ไทย",
  en: "EN",
  my: "မြန်မာ",
  lo: "ລາວ",
};

export type LocaleSwitcherProps = {
  /** Compact pill style (used inside the Wallet app); default is the nav style. */
  compact?: boolean;
  className?: string;
};

/**
 * Switches locale while preserving the current path (next-intl navigation).
 * Replaces both the old nav.js (no switcher existed) and the Wallet app's
 * standalone th/my/lo language buttons.
 */
export function LocaleSwitcher({ compact = false, className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function select(next: Locale) {
    setOpen(false);
    if (next !== locale) router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 font-500 text-ink-600 hover:text-brand-600 transition-colors",
          compact
            ? "rounded-full bg-white/12 px-2.5 py-1 text-xs text-white"
            : "rounded-lg px-2.5 py-1.5 text-sm hover:bg-sky-100",
        )}
      >
        {!compact && <Icon name="globe" size={18} />}
        <span>{SHORT[locale as Locale]}</span>
        <Icon name="chevD" size={14} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 w-40 card p-1.5 z-50"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => select(l)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  l === locale
                    ? "bg-sky-100 text-brand-700 font-600"
                    : "text-ink-700 hover:bg-sky-50",
                )}
              >
                {LABELS[l]}
                {l === locale && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
