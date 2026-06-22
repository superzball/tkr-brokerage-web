// src/lib/auth/guards.ts
// Role-based access derived directly from the locked IA (portal-nav.ts).
// A route is allowed for a role iff that role's sidebar lists it (or a parent).

import { portalNav } from "@/config/portal-nav";
import type { Role } from "@/types/portal";

/** All hrefs a role may reach, flattened from its sidebar sections. */
function allowedHrefs(role: Role): string[] {
  return portalNav[role].flatMap((section) => section.items.map((i) => i.href));
}

/** Does `role` have access to `href` (exact match or a nested child route)? */
export function roleCanAccess(role: Role, href: string): boolean {
  return allowedHrefs(role).some(
    (allowed) => href === allowed || href.startsWith(allowed + "/"),
  );
}
