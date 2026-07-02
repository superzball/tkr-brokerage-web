import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/routing";
import { LEARN_PRODUCT_KEYS } from "@/config/learn";
import { SEO_LANDING_SLUGS } from "@/config/conversion";
import { SITE_URL } from "@/config/site";
import { getArticles } from "@/lib/articles";

/**
 * /sitemap.xml — every public (marketing) route, per locale, with hreflang
 * alternates. The authed portal (/app), back-office (/admin) and /api are
 * deliberately absent — they're disallowed in robots.ts too.
 *
 * Route sources stay live so nothing drifts: flagship + SEO product slugs
 * come from the config that also drives generateStaticParams, article slugs
 * from the file-based CMS (published only).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/insurance",
    ...LEARN_PRODUCT_KEYS.map((k) => `/insurance/${k}`),
    ...SEO_LANDING_SLUGS.map((s) => `/insurance/${s}`),
    "/worker-insurance",
    "/auto",
    "/about",
    "/about/why",
    "/about/partners",
    "/about/agent",
    "/agency",
    "/customer",
    "/help",
    "/help/faq",
    "/help/claims",
    "/help/how-to-buy",
    "/promotions",
    "/articles",
    "/contact",
    "/reviews",
    "/line",
    "/tracking",
    "/wallet",
    "/tools/tax-calculator",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies",
    "/legal/consent",
    "/legal/data-request",
  ];

  const articles = getArticles({ publishedOnly: true });
  const articlePaths = articles.map((a) => `/articles/${a.slug}`);

  const lastModified = new Date();

  return [...staticPaths, ...articlePaths].flatMap((path) => {
    const alternates = {
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ["x-default", `${SITE_URL}/${defaultLocale}${path}`],
      ]),
    };
    return locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path.startsWith("/articles/") ? 0.6 : 0.7,
      alternates,
    }));
  });
}
