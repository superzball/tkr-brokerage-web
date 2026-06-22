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
 * Where each role lands after authentication. The portal IA (portal-nav.ts)
 * puts every role's home at `/app/dashboard`; the dashboard renders
 * role-specific content. One scheme keeps redirects + guards simple.
 */
export const landingPath = (_role: Role): string => "/app/dashboard";
