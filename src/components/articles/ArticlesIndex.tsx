// src/components/articles/ArticlesIndex.tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/cn";
import { ArticleCard } from "./ArticleCard";
import type { Article, ArticleCategory } from "@/types/portal";

/** Client index: search + category filter (แรงงาน/รถยนต์/เดินทาง/ทั้งหมด) over
 *  the published articles handed in by the server page. The newest article is
 *  featured when no filter is active. */
export function ArticlesIndex({
  articles,
  categories,
}: {
  articles: Article[];
  categories: ArticleCategory[];
}) {
  const t = useTranslations("articles");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ArticleCategory | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return articles.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!needle) return true;
      return (
        a.title.toLowerCase().includes(needle) ||
        (a.excerpt ?? "").toLowerCase().includes(needle) ||
        (a.categoryLabel ?? a.category).toLowerCase().includes(needle)
      );
    });
  }, [articles, q, cat]);

  const showFeature = cat === "all" && !q.trim();
  const feature = showFeature ? filtered[0] : undefined;
  const rest = feature ? filtered.slice(1) : filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      {/* controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
            <Icon name="search" size={18} />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="field pl-10"
            aria-label={t("searchPlaceholder")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            {t("allCategories")}
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
              {t(`cat.${c}`)}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="search" title={t("noResults")} />
      ) : (
        <>
          {feature && (
            <div className="mb-8">
              <p className="text-xs font-700 uppercase tracking-wide text-ink-400 mb-3">
                {t("featured")}
              </p>
              <div className="max-w-3xl">
                <ArticleCard article={feature} variant="feature" />
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <>
              {feature && (
                <p className="text-xs font-700 uppercase tracking-wide text-ink-400 mb-3">
                  {t("latest")}
                </p>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "chip transition-colors",
        active
          ? "bg-brand-500 text-white"
          : "bg-white border border-ink-100 text-ink-600 hover:border-brand-200 hover:text-brand-700",
      )}
    >
      {children}
    </button>
  );
}
