// src/components/app/TopBar.tsx
// App-shell top bar: mobile menu button, notifications bell, locale switcher,
// and the user menu (with mock sign-out). Reads the user from useSession().

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { useSession } from "@/lib/auth/SessionProvider";
import { signOut } from "@/lib/auth/actions";
import { getNotifications } from "@/lib/mock/seed";
import type { Locale, Notification } from "@/types/portal";
import { cn } from "@/lib/cn";

/** Close on outside click and on Escape (keyboard a11y for the dropdowns). */
function useDismiss<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return ref;
}

const NOTIF_ICON: Record<Notification["kind"], IconName> = {
  policy: "shield",
  claim: "file",
  billing: "creditcard",
  system: "info",
};

function initials(name: string) {
  const clean = name.replace(/^คุณ\s*/, "");
  return clean.slice(0, 2);
}

export function TopBar({
  onMenu,
  tone = "friendly",
}: {
  onMenu: () => void;
  /** "premium" → refined back-office bar (same light palette, sharper, neutral
   *  tool-like hovers). */
  tone?: "friendly" | "premium";
}) {
  const premium = tone === "premium";
  const iconBtn = premium
    ? "rounded-md text-ink-500 hover:bg-ink-50 hover:text-ink-800"
    : "rounded-xl text-ink-600 hover:bg-sky-100";
  const user = useSession();
  const t = useTranslations("app");
  const format = useFormatter();
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bellRef = useDismiss<HTMLDivElement>(() => setBellOpen(false));
  const menuRef = useDismiss<HTMLDivElement>(() => setMenuOpen(false));

  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(getNotifications().filter((n) => n.read).map((n) => n.id)),
  );
  const notifications = getNotifications();
  const unread = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-[68px] bg-white/85 backdrop-blur-xl border-b border-ink-100 flex items-center gap-2 px-4 sm:px-6",
        premium
          ? "shadow-[0_1px_0_rgba(11,34,64,0.04)]"
          : "shadow-[0_1px_0_rgba(11,34,64,0.02),0_8px_24px_-20px_rgba(11,34,64,0.25)]",
      )}
    >
      <button
        onClick={onMenu}
        className={cn("lg:hidden w-10 h-10 flex items-center justify-center", iconBtn)}
        aria-label={t("menu")}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Notifications */}
      <div ref={bellRef} className="relative">
        <button
          onClick={() => setBellOpen((o) => !o)}
          aria-label={t("notifications")}
          aria-haspopup="true"
          aria-expanded={bellOpen}
          className={cn("relative w-10 h-10 flex items-center justify-center", iconBtn)}
        >
          <Icon name="bell" size={20} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-700 flex items-center justify-center tabnum">
              {unread}
            </span>
          )}
        </button>
        {bellOpen && (
          <div
            role="region"
            aria-label={t("notifications")}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] card p-2 z-50"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm font-700 text-ink-900">
                {t("notifications")}
              </span>
              {unread > 0 && (
                <button
                  onClick={() => setReadIds(new Set(notifications.map((n) => n.id)))}
                  className="text-xs font-600 text-brand-600 hover:underline"
                >
                  {t("markAllRead")}
                </button>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-2 py-6 text-center text-sm text-ink-400">
                  {t("noNotifications")}
                </li>
              ) : (
                notifications.map((n) => {
                  const isUnread = !readIds.has(n.id);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setReadIds((s) => new Set(s).add(n.id))
                        }
                        className={cn(
                          "w-full text-left flex gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-sky-50",
                          isUnread && "bg-sky-50",
                        )}
                      >
                        <span className="mt-0.5 w-7 h-7 rounded-lg bg-sky-100 text-brand-600 flex items-center justify-center shrink-0">
                          <Icon name={NOTIF_ICON[n.kind]} size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-ink-800 leading-snug">
                            {n.title}
                          </span>
                          <span className="block mt-0.5 text-xs text-ink-400">
                            {format.dateTime(new Date(n.time), {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                        {isUnread && (
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      <LocaleSwitcher />

      {/* User menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 pl-1 pr-2 py-1 rounded-full",
            premium ? "hover:bg-ink-50" : "hover:bg-sky-100",
          )}
          aria-label={t("userMenu")}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-700"
            style={{ background: user.avatarColor ?? "#1f66ee" }}
          >
            {initials(user.name)}
          </span>
          <span className="hidden sm:block text-sm font-600 text-ink-800 max-w-[140px] truncate">
            {user.name}
          </span>
          <Icon name="chevD" size={14} className="text-ink-400" />
        </button>
        {menuOpen && (
          <div role="menu" className="absolute right-0 top-full mt-2 w-56 card p-1.5 z-50">
            <div className="px-3 py-2 border-b border-ink-100 mb-1">
              <p className="text-sm font-600 text-ink-900 truncate">
                {user.name}
              </p>
              {user.company && (
                <p className="text-xs text-ink-500 truncate">{user.company}</p>
              )}
              <p className="text-xs text-ink-400 mt-0.5">{user.email}</p>
            </div>
            <button
              disabled={pending}
              onClick={() => startTransition(() => signOut(locale))}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-700 hover:bg-sky-50 disabled:opacity-50"
            >
              <Icon name="arrowRight" size={16} />
              {t("signOut")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
