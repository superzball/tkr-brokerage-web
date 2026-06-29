import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  getPublishedArticles,
  getPublishedArticle,
} from "@/lib/mock/seed";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { ArticleCover } from "@/components/articles/ArticleCover";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import { ROUTES } from "@/config/nav";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPublishedArticles().map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) return {};
  const title = article.seo.metaTitle || article.title;
  const description = article.seo.metaDescription || article.excerpt || "";
  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: article.seo.ogImage ? [article.seo.ogImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getPublishedArticle(slug);
  if (!article) notFound();

  const t = await getTranslations("articles");

  const related = getPublishedArticles()
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <main>
      <article>
        {/* header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 mb-5"
          >
            <Icon name="chevR" size={16} className="rotate-180" /> {t("backToList")}
          </Link>
          <Chip className="bg-sky-100 text-brand-700">{article.category}</Chip>
          <h1 className="mt-4 font-display font-700 text-3xl sm:text-4xl text-ink-900 leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-500">
            <span>{t("by")} {article.author}</span>
            {article.publishedAt && <span className="tabnum">· {article.publishedAt}</span>}
            {article.readMinutes && (
              <span className="inline-flex items-center gap-1 tabnum">
                · <Icon name="clock" size={14} /> {t("minRead", { n: article.readMinutes })}
              </span>
            )}
          </div>
        </div>

        <ArticleCover
          tone={article.cover}
          className="h-56 sm:h-72 max-w-4xl mx-auto sm:rounded-3xl my-8"
        />

        {/* body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          {article.excerpt && (
            <p className="text-lg text-ink-700 leading-relaxed font-500">{article.excerpt}</p>
          )}
          <div className="mt-5 space-y-4 text-ink-700 leading-relaxed">
            {(article.body ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-ink-400">
            {t("availableIn")}:
            {article.locales.map((l) => (
              <span key={l} className="chip bg-ink-50 text-ink-500 text-xs uppercase">{l}</span>
            ))}
          </div>
        </div>
      </article>

      <RelatedArticles articles={related} />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-600 to-ink-900 text-white p-8 text-center">
          <div className="absolute inset-0 bg-grid opacity-15" />
          <div className="relative">
            <h2 className="font-display font-700 text-2xl">{t("ctaTitle")}</h2>
            <p className="mt-1.5 text-white/80">{t("ctaDesc")}</p>
            <Button href={ROUTES.worker} variant="gold" size="lg" className="mt-5">
              {t("cta")} <Icon name="arrowRight" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
