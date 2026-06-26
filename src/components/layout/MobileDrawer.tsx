"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Logo } from "./Logo";
import { publicNav, publicNavActions } from "@/config/nav";
import type { TopNavItem } from "@/types/portal";
import { cn } from "@/lib/cn";

export type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

/**
 * Full-screen mobile nav (Phase 19). Each mega top item becomes a collapsible
 * accordion (columns flatten into stacked groups); simple items are direct
 * links. Footer carries locale, login, agent login + the quote CTA.
 */
export function MobileDrawer({ open, onClose, pathname }: MobileDrawerProps) {
  // Nav labels use dynamic keys from config → plain string lookup.
  const t = useTranslations("topnav") as unknown as (key: string) => string;
  const [openKey, setOpenKey] = useState<string | null>("products");

  const linkActive = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div
      className="lg:hidden fixed inset-0 z-50"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      {/* full-screen panel */}
      <div
        className={cn(
          "absolute inset-0 bg-white flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-ink-100 shrink-0">
          <Logo />
          <button
            onClick={onClose}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-sky-100 text-ink-800"
            aria-label={t("close")}
          >
            <Icon name="x" size={24} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {publicNav.map((item: TopNavItem) => {
            if (!item.columns) {
              return (
                <Link
                  key={item.key}
                  href={item.href ?? "#"}
                  onClick={onClose}
                  className={cn(
                    "block px-3 py-3.5 rounded-xl text-[1.02rem] font-600",
                    linkActive(item.href ?? "")
                      ? "bg-sky-100 text-brand-700"
                      : "text-ink-800 hover:bg-sky-50",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            }
            const isOpen = openKey === item.key;
            return (
              <div key={item.key} className="border-b border-ink-50 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-3 py-3.5 text-[1.02rem] font-600 text-ink-800"
                >
                  {t(item.key)}
                  <Icon
                    name="chevD"
                    size={18}
                    className={cn(
                      "text-ink-400 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {/* smooth grid-rows accordion */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pb-2 space-y-3">
                      {item.featured && (
                        <AppLink
                          href={item.featured.href}
                          onClick={onClose}
                          className="mx-2 flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-3"
                        >
                          {item.featured.icon && (
                            <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center bg-white/15 shrink-0">
                              <Icon name={item.featured.icon} />
                            </span>
                          )}
                          <span className="text-sm font-700">
                            {t(item.featured.key)}
                          </span>
                        </AppLink>
                      )}
                      {item.columns.map((col) => (
                        <div key={col.key}>
                          <p className="px-3 pb-1 text-[0.66rem] font-700 uppercase tracking-wide text-ink-400">
                            {t(col.key)}
                          </p>
                          {col.links.map((link) => (
                            <AppLink
                              key={link.key}
                              href={link.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.95rem]",
                                linkActive(link.href)
                                  ? "bg-sky-100 text-brand-700 font-600"
                                  : "text-ink-700 hover:bg-sky-50",
                              )}
                            >
                              {link.icon && (
                                <span className="inline-flex w-8 h-8 rounded-lg items-center justify-center bg-sky-100 text-brand-600 shrink-0">
                                  <Icon name={link.icon} size={17} />
                                </span>
                              )}
                              {t(link.key)}
                            </AppLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-ink-100 space-y-3 shrink-0">
          <div className="flex items-center justify-center">
            <LocaleSwitcher className="px-1" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              href={publicNavActions.login.href}
              variant="ghost"
              size="md"
              onClick={onClose}
            >
              {t(publicNavActions.login.key)}
            </Button>
            <Button
              href={publicNavActions.quoteCta.href}
              variant="primary"
              size="md"
              onClick={onClose}
            >
              {t(publicNavActions.quoteCta.key)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
