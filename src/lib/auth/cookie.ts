// src/lib/auth/cookie.ts
// Edge-safe session cookie constants. Kept import-free (no next/headers) so
// both the proxy/middleware (Edge runtime) and server code can share them.

export const SESSION_COOKIE = "tkr_session";

/** 7 days, in seconds. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
