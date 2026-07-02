import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { SITE_URL, IS_INDEXABLE } from "@/config/site";

/**
 * /robots.txt — crawling policy per environment.
 *
 * Only the production host may be indexed: unless NEXT_PUBLIC_SITE_ENV is
 * "production" we serve a BLOCK-ALL file so UAT/preview deploys never leak
 * into search results. Production allows everything except the authed
 * portal (/{locale}/app), the back-office (/{locale}/admin) and /api.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          ...locales.flatMap((l) => [`/${l}/app/`, `/${l}/admin/`]),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
