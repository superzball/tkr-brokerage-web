"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Logo } from "./Logo";
import { ProductMenu } from "./ProductMenu";
import { ServicesMenu } from "./ServicesMenu";
import { MobileDrawer } from "./MobileDrawer";
import {
  ROUTES,
  PRODUCT_ACTIVE_KEYS,
  SERVICE_ACTIVE_KEYS,
} from "@/config/nav";
import { cn } from "@/lib/cn";

/** Map the current (locale-stripped) pathname to a page key for active state. */
function activeKeyFor(pathname: string): string {
  if (pathname === "/") return "home";
  const entry = Object.entries(ROUTES).find(
    ([, href]) => href !== "/" && pathname.startsWith(href),
  );
  return entry?.[0] ?? "";
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const activeKey = activeKeyFor(pathname);
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLink = (key: string, href: string, label: string) => (
    <Link
      href={href}
      className={cn("nav-link", activeKey === key && "active")}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white/85 backdrop-blur-xl border-b border-ink-100/70">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          <Logo priority />

          <div className="hidden lg:flex items-center gap-7">
            {navLink("home", ROUTES.home, t("home"))}
            <ProductMenu active={PRODUCT_ACTIVE_KEYS.includes(activeKey)} />
            {navLink("customer", ROUTES.customer, t("customer"))}
            {navLink("agency", ROUTES.agency, t("agency"))}
            {navLink("promotions", ROUTES.promotions, t("promotions"))}
            <ServicesMenu active={SERVICE_ACTIVE_KEYS.includes(activeKey)} />
          </div>

          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <LocaleSwitcher />
            <Button href="/login" variant="ghost" size="sm">
              {t("login")}
            </Button>
            <Button href={ROUTES.worker} variant="primary" size="sm">
              {t("startBuy")}
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

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        activeKey={activeKey}
      />
    </header>
  );
}
