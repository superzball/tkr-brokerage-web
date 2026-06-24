// src/lib/auth/rbac.ts
// Back-office RBAC (Phase 14). Permissions are derived straight from the
// `perm` fields on portalNav.admin — the IA is the single source of truth.
//
// staffRole → what they can do:
//   superadmin → everything
//   ops        → operations / accounts / finance / support
//   content    → content & SEO
//   sales      → on-behalf sales
// Items/sections with no `perm` are visible to every staff member.

import { portalNav } from "@/config/portal-nav";
import type { NavSection, User } from "@/types/portal";

/** Does this staff user satisfy a single permission token? */
export function staffCan(
  user: Pick<User, "staffRole" | "permissions">,
  perm?: string,
): boolean {
  if (!perm) return true; // ungated
  if (user.staffRole === "superadmin") return true; // sees all
  if (user.staffRole === perm) return true; // role token matches (ops/content/sales)
  return user.permissions?.includes(perm) ?? false; // fine-grained override
}

/** portalNav.admin filtered to the sections/items this staff user may see. */
export function adminNavFor(user: User): NavSection[] {
  return portalNav.admin
    .map((section) => ({
      ...section,
      items: section.items.filter((i) => staffCan(user, i.perm)),
    }))
    .filter((section) => staffCan(user, section.perm) && section.items.length > 0);
}

/**
 * Can this staff user reach an admin href? Resolves the most-specific nav item
 * matching the path and checks both its section and item perms. Unknown admin
 * routes (no matching nav item) are denied.
 */
export function adminCanAccess(user: User, href: string): boolean {
  if (user.role !== "admin") return false;
  const items = portalNav.admin.flatMap((s) =>
    s.items.map((i) => ({ href: i.href, perm: i.perm, sectionPerm: s.perm })),
  );
  const match = items
    .filter((i) => href === i.href || href.startsWith(i.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (!match) return false;
  return staffCan(user, match.sectionPerm) && staffCan(user, match.perm);
}
