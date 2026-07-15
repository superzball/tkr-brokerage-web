// src/components/articles/ArticleCard.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ArticleCover } from "./ArticleCover";
import type { Article } from "@/types/portal";

/** Article preview card — links to /articles/[slug]. Used in the index grid,
 *  the featured slot (variant="feature"), and related lists. */
export function ArticleCard({
  article,
  variant = "grid",
}: {
  article: Article;
  variant?: "grid" | "feature";
}) {
  const t = useTranslations("articles");
  const feature = variant === "feature";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="card card-hover overflow-hidden group flex flex-col"
    >
      <ArticleCover
        src={article.cover}
        alt={article.title}
        sizes={feature ? "(min-width: 768px) 48rem, 100vw" : undefined}
        className={feature ? "h-56" : "h-40"}
      />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <Chip className="bg-sky-100 text-brand-700 text-xs">
            {article.categoryLabel ?? article.category}
          </Chip>
          {article.readMinutes && (
            <span className="inline-flex items-center gap-1 tabnum">
              <Icon name="clock" size={13} /> {t("minRead", { n: article.readMinutes })}
            </span>
          )}
        </div>
        <h3
          className={
            feature
              ? "mt-3 font-display font-700 text-2xl text-ink-900 leading-snug group-hover:text-brand-700 transition-colors"
              : "mt-3 font-600 text-ink-900 leading-snug group-hover:text-brand-700 transition-colors"
          }
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 pt-3 border-t border-ink-50 flex items-center justify-between text-xs text-ink-400">
          <span>{article.author}</span>
          <span className="tabnum">{article.publishedAt}</span>
        </div>
      </div>
    </Link>
  );
}
