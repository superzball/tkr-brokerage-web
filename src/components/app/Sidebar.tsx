// src/components/app/Sidebar.tsx
// Role-aware sidebar, rendered straight from portalNav[role] (the locked IA).
// Active state comes from next-intl's usePathname (locale already stripped).

"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { portalNav } from "@/config/portal-nav";
import type { NavSection, Role } from "@/types/portal";
import { Logo } from "@/components/layout/Logo";
import { NavIcon } from "./NavIcon";
import { cn } from "@/lib/cn";

export function Sidebar({
  role,
  sections: sectionsProp,
  onNavigate,
  className,
}: {
  /** Render this role's IA (portalNav[role]) … */
  role?: Role;
  /** …or pass pre-filtered sections directly (e.g. RBAC-filtered admin nav). */
  sections?: NavSection[];
  /** Called after a link is tapped (closes the mobile drawer). */
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const sections = sectionsProp ?? (role ? portalNav[role] : []);

  // Mark only the single most-specific matching href active. (A plain prefix
  // test would light up the "/admin" overview item on every nested route.)
  const activeHref = sections
    .flatMap((s) => s.items.map((i) => i.href))
    .filter((h) => pathname === h || pathname.startsWith(h + "/"))
    .sort((a, b) => b.length - a.length)[0];

  // NavItem.key / NavSection.key are `string` in the contract; the nav catalog
  // keys are statically present, so assert them to the namespaced key type.
  type NavKey = Parameters<typeof t>[0];

  return (
    <aside
      className={cn(
        "w-64 shrink-0 flex flex-col bg-white border-r border-ink-100",
        className,
      )}
    >
      <div className="h-[68px] flex items-center px-5 border-b border-ink-100">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-6">
        {sections.map((section, i) => (
          <div key={section.key ?? i}>
            {section.key && (
              <p className="px-3 mb-1.5 text-[11px] font-700 uppercase tracking-wide text-ink-400">
                {t(section.key as NavKey)}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-500 transition-colors",
                        active
                          ? "bg-sky-100 text-brand-700 font-600"
                          : "text-ink-600 hover:bg-sky-50 hover:text-ink-900",
                      )}
                    >
                      <NavIcon name={item.icon} size={19} />
                      {t(item.key as NavKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
