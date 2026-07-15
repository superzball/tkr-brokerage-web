import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getArticles, getArticleBySlug } from "@/lib/articles";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { ArticleCover } from "@/components/articles/ArticleCover";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import type { ArticleCategory } from "@/types/portal";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

/** Category-matched end-of-article CTA → the product's learn landing. */
const CTA_HREF: Record<ArticleCategory, string> = {
  worker: "/insurance/worker",
  auto: "/insurance/auto",
  travel: "/insurance/travel",
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getArticles({ publishedOnly: true }).map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug, { publishedOnly: true });
  if (!article) return {};
  const title = article.seo.metaTitle || article.title;
  const description = article.seo.metaDescription || article.excerpt || "";
  const ogImage = article.seo.ogImage || article.cover;
  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticleBySlug(slug, { publishedOnly: true });
  if (!article) notFound();

  const t = await getTranslations("articles");

  const related = getArticles({ publishedOnly: true })
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const ctaCat: ArticleCategory = article.category in CTA_HREF
    ? (article.category as ArticleCategory)
    : "worker";

  return (
    <main>
      <article>
        {/* hero banner (every article ships a wide 3.34:1 crop) — desktop only;
            mobile keeps the 16:9 cover below the header instead */}
        {article.hero && (
          <ArticleCover
            src={article.hero}
            alt={article.title}
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="hidden sm:block h-64 lg:h-80 max-w-6xl mx-auto mt-8 sm:rounded-3xl"
          />
        )}

        {/* header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600 mb-5"
          >
            <Icon name="chevR" size={16} className="rotate-180" /> {t("backToList")}
          </Link>
          <Chip className="bg-sky-100 text-brand-700">
            {article.categoryLabel ?? article.category}
          </Chip>
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
          src={article.cover}
          alt={article.title}
          priority
          sizes="(min-width: 896px) 56rem, 100vw"
          className={
            article.hero
              ? "sm:hidden h-56 my-8" // hero already shown on desktop
              : "h-56 sm:h-72 max-w-4xl mx-auto sm:rounded-3xl my-8"
          }
        />

        {/* body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <ArticleBody markdown={article.bodyMd ?? ""} />

          <div className="mt-8 flex items-center gap-2 text-xs text-ink-400">
            {t("availableIn")}:
            {article.locales.map((l) => (
              <span key={l} className="chip bg-ink-50 text-ink-500 text-xs uppercase">{l}</span>
            ))}
          </div>
        </div>
      </article>

      <RelatedArticles articles={related} />

      {/* CTA — matched to the article's category */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-600 to-ink-900 text-white p-8 text-center">
          <div className="absolute inset-0 bg-grid opacity-15" />
          <div className="relative">
            <h2 className="font-display font-700 text-2xl">{t(`ctaByCat.${ctaCat}.title`)}</h2>
            <p className="mt-1.5 text-white/80">{t(`ctaByCat.${ctaCat}.desc`)}</p>
            <Button href={CTA_HREF[ctaCat]} variant="gold" size="lg" className="mt-5">
              {t(`ctaByCat.${ctaCat}.btn`)} <Icon name="arrowRight" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
