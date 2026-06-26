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
  findStaffByRole,
  findOrCreateGuestByPhone,
  completeProfile,
  landingPath,
  type SocialProvider,
} from "./mock";
import { users } from "@/lib/mock/seed";
import type { Locale, Role, StaffRole } from "@/types/portal";

async function startSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Sanitize a post-login `next` target. Strips a leading locale segment (the
 * proxy emits locale-prefixed paths) and only allows in-app destinations.
 */
function resolveNext(next: string | undefined, locale: Locale): string | undefined {
  if (!next) return undefined;
  let p = next;
  const seg = p.split("/");
  if (seg[1] === locale) p = "/" + seg.slice(2).join("/");
  return p.startsWith("/app") || p.startsWith("/admin") ? p : undefined;
}

export type AuthError = "credentials" | "phone" | "otp";
export type AuthResult = { ok: true } | { ok: false; error: AuthError };

/** Email + password (the demo accounts; password = `demo1234`). */
export async function signInWithPassword(
  locale: Locale,
  email: string,
  password: string,
  next?: string,
): Promise<AuthResult> {
  const user = findUserByEmail(email);
  if (!user || password !== DEMO_PASSWORD) {
    return { ok: false, error: "credentials" };
  }
  await startSession(user.id);
  redirect({ href: resolveNext(next, locale) ?? landingPath(user.role), locale });
  return { ok: true }; // unreachable — redirect() throws
}

/** One-tap demo sign-in used by the placeholder /login screen. */
export async function signInAsRole(
  locale: Locale,
  role: Role,
  next?: string,
): Promise<void> {
  const user = users.find((u) => u.role === role);
  if (!user) return;
  await startSession(user.id);
  redirect({ href: resolveNext(next, locale) ?? landingPath(role), locale });
}

/**
 * One-tap back-office sign-in as a specific staffRole (superadmin/ops/content/
 * sales). Powers the admin RBAC demo — each role sees a different sidebar and
 * 403s on routes outside its permissions.
 */
export async function signInAsStaff(
  locale: Locale,
  staffRole: StaffRole,
): Promise<void> {
  const user = findStaffByRole(staffRole);
  if (!user) return;
  await startSession(user.id);
  redirect({ href: "/admin", locale });
}

/**
 * "Send" an OTP to a phone. Mock: a real backend would dispatch an SMS to any
 * number (registered or not — that's resolved at verify time), so this always
 * succeeds. Login verification still checks the phone maps to a known user.
 */
export async function requestOtp(_phone: string): Promise<AuthResult> {
  return { ok: true };
}

/**
 * Verify a phone OTP for login (mock code = `123456`). A demo phone signs in as
 * its owner; any other number falls back to the individual demo account, so the
 * "code 123456 works" promise holds for the phone-first primary method.
 */
export async function verifyOtp(
  locale: Locale,
  phone: string,
  code: string,
  next?: string,
): Promise<AuthResult> {
  if (code !== DEMO_OTP) return { ok: false, error: "otp" };
  const user =
    findUserByPhone(phone) ?? users.find((u) => u.role === "individual")!;
  await startSession(user.id);
  redirect({ href: resolveNext(next, locale) ?? landingPath(user.role), locale });
  return { ok: true }; // unreachable — redirect() throws
}

/**
 * Verify a signup OTP. No account exists yet, so a correct code just advances
 * to the role's onboarding wizard (the session is created when onboarding ends).
 */
export async function verifySignupOtp(
  locale: Locale,
  role: Role,
  code: string,
): Promise<AuthResult> {
  if (code !== DEMO_OTP) return { ok: false, error: "otp" };
  redirect({ href: `/onboarding/${role}`, locale });
  return { ok: true }; // unreachable — redirect() throws
}

/** Mock "send a reset link". Always succeeds (no email is actually sent). */
export async function requestPasswordReset(
  _email: string,
): Promise<AuthResult> {
  return { ok: true };
}

/** Mock password reset. Always succeeds. */
export async function resetPassword(_password: string): Promise<AuthResult> {
  return { ok: true };
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

/**
 * Guest checkout: verify a phone OTP RIGHT BEFORE payment and start a session
 * silently — framed as "verify to receive your policy", never register/login.
 * Returns `guest: false` when the phone resolved to an existing full account
 * (so the buyer resumes that account — login without saying so). No redirect;
 * the checkout flow continues in place.
 */
export async function startGuestSession(
  phone: string,
  code: string,
): Promise<{ ok: true; guest: boolean } | { ok: false; error: AuthError }> {
  if (code !== DEMO_OTP) return { ok: false, error: "otp" };
  const user = findOrCreateGuestByPhone(phone);
  await startSession(user.id);
  return { ok: true, guest: user.status === "guest" && !user.profileComplete };
}

/**
 * Progressive profile: a guest adds name/email/address after purchase, which
 * promotes them to a full `active` account. Reads the current session cookie.
 */
export async function completeGuestProfile(fields: {
  name?: string;
  email?: string;
  address?: string;
}): Promise<AuthResult> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return { ok: false, error: "credentials" };
  completeProfile(id, fields);
  return { ok: true };
}

export async function signOut(locale: Locale): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect({ href: "/", locale });
}
