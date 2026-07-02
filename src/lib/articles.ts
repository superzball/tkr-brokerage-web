// src/lib/articles.ts
// File-based article CMS (server-only): loads /content/articles/*.md — flat
// gray-matter-style frontmatter (title, slug, metaTitle, metaDescription,
// excerpt, cover, category, author, date, published) + a markdown body.
// Replaces the old placeholder articles in lib/mock/seed.
import fs from "node:fs";
import path from "node:path";
import type { Article } from "@/types/portal";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/** Minimal frontmatter parser for the flat `key: value` block these files use.
 *  Handles quoted strings, `null`, and booleans — no nesting. */
function parseFrontmatter(raw: string): { data: Record<string, string | boolean | undefined>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string | boolean | undefined> = {};
  for (const line of (m[1] ?? "").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (value === "null" || value === "") { data[key] = undefined; continue; }
    if (value === "true" || value === "false") { data[key] = value === "true"; continue; }
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1);
    data[key] = value;
  }
  return { data, body: raw.slice(m[0].length) };
}

function toArticle(raw: string, filename: string): Article {
  const { data, body } = parseFrontmatter(raw);
  const str = (k: string) => (typeof data[k] === "string" ? (data[k] as string) : "");
  // The body repeats the title as a leading H1 — the pages render their own H1.
  const bodyMd = body.replace(/^\s*#[^\n]*\n/, "").trim();
  const slug = str("slug") || filename.replace(/\.md$/, "");
  return {
    id: slug,
    title: str("title"),
    slug,
    status: data.published === false ? "draft" : "published",
    category: str("category"),
    author: str("author"),
    locales: ["th"], // Thai-only for now; en/my/lo translations come later
    publishedAt: str("date") || undefined,
    seo: { metaTitle: str("metaTitle"), metaDescription: str("metaDescription") },
    excerpt: str("excerpt") || undefined,
    cover: str("cover") || undefined,
    // Thai has no word spaces — estimate read time from characters (~1000/min)
    readMinutes: Math.max(1, Math.round(bodyMd.length / 1000)),
    bodyMd,
  };
}

let cache: Article[] | null = null;

function loadAll(): Article[] {
  if (cache) return cache;
  const files = fs.existsSync(ARTICLES_DIR)
    ? fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"))
    : [];
  cache = files
    .map((f) => toArticle(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8"), f))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  return cache;
}

/** All articles, newest first, WITHOUT bodyMd — list payloads reach client
 *  components (cards, admin table), so the ~10KB bodies stay server-side.
 *  `publishedOnly` hides drafts (public site). */
export const getArticles = (opts?: { publishedOnly?: boolean }) =>
  loadAll()
    .filter((a) => !opts?.publishedOnly || a.status === "published")
    .map(({ bodyMd: _bodyMd, ...rest }) => rest as Article);

/** One full article (incl. bodyMd) by slug, or null. Public callers pass publishedOnly. */
export const getArticleBySlug = (slug: string, opts?: { publishedOnly?: boolean }) =>
  loadAll().find(
    (a) => a.slug === slug && (!opts?.publishedOnly || a.status === "published"),
  ) ?? null;

/** Distinct categories across published articles (for the list filter). */
export const getArticleCategories = () =>
  [...new Set(getArticles({ publishedOnly: true }).map((a) => a.category))];
