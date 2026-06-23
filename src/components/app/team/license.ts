// src/components/app/team/license.ts
// License-status → StatusBadge tone, shared across the team screens.
import type { BadgeTone } from "@/components/app/StatusBadge";
import type { LicenseStatus } from "@/types/portal";

export const licenseTone: Record<LicenseStatus, BadgeTone> = {
  verified: "success",
  pending: "warning",
  expired: "danger",
};
