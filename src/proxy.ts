import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE } from "./lib/auth/cookie";

/**
 * Locale negotiation + routing. In Next.js 16 the former `middleware.ts`
 * file is named `proxy.ts`; next-intl's `createMiddleware` is the same API.
 */
const intlMiddleware = createMiddleware(routing);

/**
 * Run locale routing first, then guard the authenticated area: any
 * `/{locale}/app/*` hit without a session cookie is bounced to `/{locale}/login`
 * (role-level access is enforced per-page from the locked IA). Edge-safe — we
 * only read the cookie name, never `next/headers`.
 */
export default function proxy(req: NextRequest): NextResponse {
  const segments = req.nextUrl.pathname.split("/");
  const locale = segments[1] || routing.defaultLocale;
  // Both the customer/agent portal (/app/*) and the back-office (/admin/*)
  // require a session; role/staffRole gating happens per-layout & per-page.
  const isProtected = segments[2] === "app" || segments[2] === "admin";

  if (isProtected && !req.cookies.get(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  // Skip Next internals, API routes, and anything with a file extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
