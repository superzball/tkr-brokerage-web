// src/lib/auth/actions.ts
// Mock auth server actions. They set/clear the httpOnly session cookie and
// redirect by role. A user's identity can be a phone, an email, or a social
// account — each resolves to the same session (a User.id cookie).

"use server";

import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./cookie";
import {
  DEMO_OTP,
  DEMO_PASSWORD,
  findUserByEmail,
  findUserByPhone,
  landingPath,
  type SocialProvider,
} from "./mock";
import { users } from "@/lib/mock/seed";
import type { Locale, Role } from "@/types/portal";

async function startSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export type AuthError = "credentials" | "phone" | "otp";
export type AuthResult = { ok: true } | { ok: false; error: AuthError };

/** Email + password (the demo accounts; password = `demo1234`). */
export async function signInWithPassword(
  locale: Locale,
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = findUserByEmail(email);
  if (!user || password !== DEMO_PASSWORD) {
    return { ok: false, error: "credentials" };
  }
  await startSession(user.id);
  redirect({ href: landingPath(user.role), locale });
  return { ok: true }; // unreachable — redirect() throws
}

/** One-tap demo sign-in used by the placeholder /login screen. */
export async function signInAsRole(locale: Locale, role: Role): Promise<void> {
  const user = users.find((u) => u.role === role);
  if (!user) return;
  await startSession(user.id);
  redirect({ href: landingPath(role), locale });
}

/** "Send" an OTP to a phone. Mock: succeeds only for a known phone. */
export async function requestOtp(phone: string): Promise<AuthResult> {
  if (!findUserByPhone(phone)) return { ok: false, error: "phone" };
  // A real backend would dispatch an SMS here. Mock accepts DEMO_OTP.
  return { ok: true };
}

/** Verify a phone OTP (mock code = `123456`). */
export async function verifyOtp(
  locale: Locale,
  phone: string,
  code: string,
): Promise<AuthResult> {
  const user = findUserByPhone(phone);
  if (!user) return { ok: false, error: "phone" };
  if (code !== DEMO_OTP) return { ok: false, error: "otp" };
  await startSession(user.id);
  redirect({ href: landingPath(user.role), locale });
  return { ok: true }; // unreachable — redirect() throws
}

/**
 * Mock social sign-in. A fresh social account has no role yet, so the caller
 * may pass the chosen role (defaults to individual). Real provider OAuth lands
 * in Phase 8 — here we just sign in as the matching demo user.
 */
export async function signInSocial(
  locale: Locale,
  _provider: SocialProvider,
  role: Role = "individual",
): Promise<void> {
  const user = users.find((u) => u.role === role);
  if (!user) return;
  await startSession(user.id);
  redirect({ href: landingPath(role), locale });
}

export async function signOut(locale: Locale): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect({ href: "/", locale });
}
