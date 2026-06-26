"use client";

import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import type { MegaColumn, MegaLink, TopNavItem } from "@/types/portal";
import { cn } from "@/lib/cn";

// Nav labels use dynamic keys from config; cast away next-intl's literal-key
// constraint to a plain string lookup.
type T = (key: string) => string;

/** One column of rich links (icon + title + one-line description). */
function Column({ col, t }: { col: MegaColumn; t: T }) {
  return (
    <div className="p-1.5">
      <p className="px-2.5 pb-1 text-[0.68rem] font-700 uppercase tracking-wide text-ink-400">
        {t(col.key)}
      </p>
      {col.links.map((link) => (
        <AppLink
          key={link.key}
          href={link.href}
          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-100 transition-colors"
        >
          {link.icon && (
            <span className="mt-0.5 inline-flex w-9 h-9 rounded-lg items-center justify-center bg-sky-100 text-brand-600 shrink-0">
              <Icon name={link.icon} />
            </span>
          )}
          <span className="min-w-0">
            <span className="block text-sm font-600 text-ink-900">
              {t(link.key)}
            </span>
            {link.descKey && (
              <span className="block text-xs text-ink-500 mt-0.5 leading-snug">
                {t(link.descKey)}
              </span>
            )}
          </span>
        </AppLink>
      ))}
    </div>
  );
}

/** The highlighted flagship card shown as the first cell of a mega panel. */
function Featured({ link, t }: { link: MegaLink; t: T }) {
  return (
    <AppLink
      href={link.href}
      className="group/flag rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white flex flex-col"
    >
      {link.badgeKey && (
        <span className="text-[0.68rem] font-700 uppercase tracking-wide text-white/75">
          {t(link.badgeKey)}
        </span>
      )}
      {link.icon && (
        <span className="mt-3 inline-flex w-11 h-11 rounded-xl items-center justify-center bg-white/15">
          <Icon name={link.icon} size={24} />
        </span>
      )}
      <span className="mt-3 font-700 text-[0.98rem]">{t(link.key)}</span>
      {link.descKey && (
        <span className="mt-1 text-[0.8rem] leading-snug text-white/85">
          {t(link.descKey)}
        </span>
      )}
      <span className="mt-auto pt-3 inline-flex items-center gap-1 text-[0.8rem] font-600">
        {t("getQuote")}
        <Icon
          name="arrowRight"
          size={15}
          className="transition-transform group-hover/flag:translate-x-0.5"
        />
      </span>
    </AppLink>
  );
}

/**
 * Generic public mega menu (Phase 19). Renders a `TopNavItem`'s optional
 * featured card + N columns, revealing on hover and keyboard focus-within.
 * Reads the `topnav` i18n namespace. Wide layout for Products, compact for
 * single-column menus (About / Help).
 */
export function MegaMenu({ item, active }: { item: TopNavItem; active: boolean }) {
  const t = useTranslations("topnav") as unknown as T;
  const columns = item.columns ?? [];
  const cells = (item.featured ? 1 : 0) + columns.length;
  const wide = cells >= 3;

  return (
    <div className="relative group/mega">
      <button
        type="button"
        className={cn("nav-link inline-flex items-center gap-1", active && "active")}
        aria-haspopup="true"
      >
        {t(item.key)}
        <Icon
          name="chevD"
          size={14}
          strokeWidth={2.4}
          className="transition-transform group-hover/mega:rotate-180 group-focus-within/mega:rotate-180"
        />
      </button>

      {/* pt-3 = hover bridge so the panel doesn't close in the gap */}
      <div className="absolute left-0 top-full pt-3 z-50 opacity-0 invisible translate-y-1 transition-all duration-200 motion-reduce:transition-none group-hover/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 group-focus-within/mega:opacity-100 group-focus-within/mega:visible group-focus-within/mega:translate-y-0">
        <div
          className="card p-2.5"
          style={{ width: `min(94vw, ${wide ? 760 : 320}px)` }}
        >
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${Math.max(cells, 1)}, minmax(0, 1fr))`,
            }}
          >
            {item.featured && <Featured link={item.featured} t={t} />}
            {columns.map((col) => (
              <Column key={col.key} col={col} t={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
