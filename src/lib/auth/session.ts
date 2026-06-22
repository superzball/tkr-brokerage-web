// src/lib/auth/session.ts
// Server-side session access. The cookie stores only a User.id; the user is
// resolved from the seed store. Swap findUserById for a real lookup later.

import "server-only";
import { cookies } from "next/headers";
import { findUserById } from "./mock";
import { SESSION_COOKIE } from "./cookie";
import type { User } from "@/types/portal";

/** The current signed-in user, or null. Reads the httpOnly session cookie. */
export async function getSession(): Promise<User | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return findUserById(id) ?? null;
}
