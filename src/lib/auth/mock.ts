// src/lib/auth/mock.ts
// Mock authentication primitives. NO BACKEND — credentials are checked against
// the seed users. A real auth provider can replace these functions without
// touching screens (they only ever call the helpers in ./actions + ./session).

import { users } from "@/lib/mock/seed";
import type { Role, User } from "@/types/portal";

/** Shared demo password (all accounts). */
export const DEMO_PASSWORD = "demo1234";
/** The only OTP code the mock accepts (all phones). */
export const DEMO_OTP = "123456";

/** Social providers offered on the login/signup screens (Phase 8). */
export const SOCIAL_PROVIDERS = ["line", "facebook", "google", "tiktok"] as const;
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

const norm = (s: string) => s.trim().toLowerCase();
/** Strip spaces/dashes so "081-000-0001" and "0810000001" match. */
const normPhone = (s: string) => s.replace(/[\s-]/g, "");

export const findUserByEmail = (email: string): User | undefined =>
  users.find((u) => u.email && norm(u.email) === norm(email));

export const findUserByPhone = (phone: string): User | undefined =>
  users.find((u) => u.phone && normPhone(u.phone) === normPhone(phone));

export const findUserById = (id: string): User | undefined =>
  users.find((u) => u.id === id);

/**
 * Where each role lands after authentication. Customers/agents share the
 * `/app/dashboard` home (the dashboard renders role-specific content); admin
 * staff land in the back-office console at `/admin`.
 */
export const landingPath = (role: Role): string =>
  role === "admin" ? "/admin" : "/app/dashboard";

/** Find a back-office staff identity by its staffRole (for the demo logins). */
export const findStaffByRole = (staffRole: string): User | undefined =>
  users.find((u) => u.role === "admin" && u.staffRole === staffRole);
