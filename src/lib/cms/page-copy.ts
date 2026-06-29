// CMS copy override for public marketing pages (Phase 14 content tool).
// Editors manage hero/body copy in /admin/content/pages. Mock CMS content is
// authored in Thai, so we only let it override the Thai locale — other locales
// fall back to the i18n message catalog. Returns null when there's no override.
import { getCmsPages } from "@/lib/mock/seed";

export type PageCopy = { hero: string; body: string };

export function cmsCopy(path: string, locale: string): PageCopy | null {
  if (locale !== "th") return null;
  const page = getCmsPages().find((p) => p.path === path);
  if (!page) return null;
  return { hero: page.hero, body: page.body };
}
