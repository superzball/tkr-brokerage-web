"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { NavSearch } from "./NavSearch";
import { MobileDrawer } from "./MobileDrawer";
import { publicNav, publicNavActions } from "@/config/nav";
import type { TopNavItem } from "@/types/portal";
import { cn } from "@/lib/cn";

/** Every route a top item points at (own href + featured + column links). */
function hrefsOf(item: TopNavItem): string[] {
  const out: string[] = [];
  if (item.href) out.push(item.href);
  if (item.featured) out.push(item.featured.href);
  item.columns?.forEach((c) => c.links.forEach((l) => out.push(l.href)));
  return out;
}

/**
 * Public marketing header (Phase 19, friendly zone). Mega menus for Products /
 * About / Help + simple Articles / Contact links, driven by `publicNav`. Right
 * side: expanding search, agent-login entry, locale, login, prominent quote CTA.
 * Sticky and shrinks on scroll; mobile collapses into a full-screen drawer.
 */
export function Navbar() {
  // Nav labels use dynamic keys from config → plain string lookup.
  const t = useTranslations("topnav") as unknown as (key: string) => string;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Sticky header subtly shrinks once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (item: TopNavItem) =>
    hrefsOf(item).some(
      (h) => h !== "/" && (pathname === h || pathname.startsWith(`${h}/`)),
    );

  return (
    <header className="sticky top-0 z-40">
      <div
        className={cn(
          "bg-white/85 backdrop-blur-xl border-b transition-shadow duration-300 motion-reduce:transition-none",
          scrolled
            ? "border-ink-100/80 shadow-card"
            : "border-ink-100/70 shadow-none",
        )}
      >
        <nav
          className={cn(
            "max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 transition-[height] duration-300 motion-reduce:transition-none",
            scrolled ? "h-[58px]" : "h-[72px]",
          )}
        >
          <Logo
            priority
            imgClassName={cn(
              "w-auto transition-[height] duration-300 motion-reduce:transition-none",
              scrolled ? "h-9" : "h-11",
            )}
          />

          {/* Center nav — hidden while the search field is expanded. */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-6",
              searchOpen && "lg:hidden",
            )}
          >
            {publicNav.map((item) =>
              item.columns ? (
                <MegaMenu key={item.key} item={item} active={isActive(item)} />
              ) : (
                <Link
                  key={item.key}
                  href={item.href ?? "#"}
                  className={cn("nav-link", isActive(item) && "active")}
                >
                  {t(item.key)}
                </Link>
              ),
            )}
          </div>

          {/* Right-side actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <NavSearch
              open={searchOpen}
              onOpen={() => setSearchOpen(true)}
              onClose={() => setSearchOpen(false)}
            />

            <span className="w-px h-5 bg-ink-100" aria-hidden="true" />

            <LocaleSwitcher />
            <Button href={publicNavActions.login.href} variant="ghost" size="sm">
              <Icon name="users" size={17} />
              {t(publicNavActions.login.key)}
            </Button>
            <Button href={publicNavActions.quoteCta.href} variant="primary" size="sm">
              {t(publicNavActions.quoteCta.key)}
            </Button>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-ink-800 hover:bg-sky-100"
            aria-label={t("menu")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </header>
  );
}
