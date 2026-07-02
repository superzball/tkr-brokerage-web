// src/components/home/HomeArticles.tsx
// Home "บทความ" preview — the 3 newest published articles from the file-based
// CMS (lib/articles.ts), linking through to /articles.
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { ArticleCard } from "@/components/articles/ArticleCard";
import type { Article } from "@/types/portal";

export async function HomeArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  const t = await getTranslations("home.articles");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8 reveal">
        <div>
          <h2 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-2 text-ink-500">{t("sub")}</p>
        </div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-600 text-brand-600 hover:text-brand-700"
        >
          {t("viewAll")} <Icon name="arrowRight" size={16} />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
