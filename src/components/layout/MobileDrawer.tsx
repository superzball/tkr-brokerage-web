"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Logo } from "./Logo";
import { MOBILE_NAV, ROUTES } from "@/config/nav";
import { cn } from "@/lib/cn";

/** Full-name labels for the drawer (worker/auto/wallet/line/tracking differ from desktop). */
type DrawerLabelKey =
  | "home"
  | "customer"
  | "agency"
  | "mobile.worker"
  | "mobile.auto"
  | "mobile.wallet"
  | "mobile.line"
  | "mobile.tracking";

const DRAWER_LABEL_KEY: Record<string, DrawerLabelKey> = {
  home: "home",
  worker: "mobile.worker",
  auto: "mobile.auto",
  customer: "customer",
  agency: "agency",
  wallet: "mobile.wallet",
  line: "mobile.line",
  tracking: "mobile.tracking",
};

export type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  activeKey: string;
};

export function MobileDrawer({ open, onClose, activeKey }: MobileDrawerProps) {
  const t = useTranslations("nav");
  return (
    <div
      className="lg:hidden fixed inset-0 z-50"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      {/* scrim */}
      <div
        className={cn(
          "absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[82%] max-w-[340px] bg-white shadow-card-lg flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-ink-100">
          <Logo />
          <button
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-sky-100 text-ink-800"
            aria-label={t("close")}
          >
            <Icon name="x" size={22} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MOBILE_NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={cn(
                "block px-3 py-3 rounded-xl text-[0.97rem] font-500",
                activeKey === item.key
                  ? "bg-sky-100 text-brand-700 font-600"
                  : "text-ink-700 hover:bg-sky-50",
              )}
            >
              {t(DRAWER_LABEL_KEY[item.key] ?? "home")}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-ink-100 space-y-3">
          <LocaleSwitcher className="px-1" />
          <div className="grid grid-cols-2 gap-2.5">
            <Button href={ROUTES.customer} variant="ghost" size="md" onClick={onClose}>
              {t("login")}
            </Button>
            <Button href={ROUTES.worker} variant="primary" size="md" onClick={onClose}>
              {t("startBuyShort")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
