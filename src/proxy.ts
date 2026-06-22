import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale negotiation + routing. In Next.js 16 the former `middleware.ts`
 * file is named `proxy.ts`; next-intl's `createMiddleware` is the same API.
 */
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, API routes, and anything with a file extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
