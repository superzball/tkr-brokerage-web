// src/components/articles/RelatedArticles.tsx
import { getTranslations } from "next-intl/server";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types/portal";

export async function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  const t = await getTranslations("articles");
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-ink-100">
      <h2 className="font-display font-700 text-2xl text-ink-900 mb-6">
        {t("relatedTitle")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
