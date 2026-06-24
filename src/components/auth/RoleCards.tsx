// src/components/auth/RoleCards.tsx
// The 3-role picker (Business / Individual / Agent). Reused by signup step 1 and
// the social-login role chooser. Reuses the worker-flow `.seg` selectable style.

"use client";

import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Role } from "@/types/portal";
import { cn } from "@/lib/cn";

// Only the 3 public signup roles — `admin` is internal (created back-office, not self-signup).
type SignupRole = Exclude<Role, "admin">;
const ROLE_META: { role: SignupRole; icon: IconName; descKey: string }[] = [
  { role: "business", icon: "building", descKey: "businessDesc" },
  { role: "individual", icon: "user", descKey: "individualDesc" },
  { role: "agent", icon: "headset", descKey: "agentDesc" },
];

export function RoleCards({
  onPick,
  selected,
  className,
}: {
  onPick: (role: Role) => void;
  selected?: Role;
  className?: string;
}) {
  const t = useTranslations("auth.roles");
  type Key = Parameters<typeof t>[0];

  return (
    <div className={cn("grid sm:grid-cols-3 gap-3", className)}>
      {ROLE_META.map(({ role, icon, descKey }) => (
        <button
          key={role}
          type="button"
          onClick={() => onPick(role)}
          aria-pressed={selected === role}
          className={cn(
            "seg flex flex-col gap-2",
            selected === role && "is-on",
          )}
        >
          <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 flex items-center justify-center">
            <Icon name={icon} size={22} />
          </span>
          <span className="font-700 text-ink-900">{t(role)}</span>
          <span className="text-xs text-ink-500 leading-snug">
            {t(descKey as Key)}
          </span>
        </button>
      ))}
    </div>
  );
}
