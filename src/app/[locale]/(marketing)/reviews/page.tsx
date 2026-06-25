import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getReviews } from "@/lib/mock/seed";
import { Reviews } from "@/components/conversion/Reviews";
import { EmptyState } from "@/components/app/EmptyState";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviewsPage" });
  return { title: t("title"), description: t("desc") };
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reviewsPage");
  const reviews = getReviews();

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-ink-600 max-w-2xl">{t("desc")}</p>
        </div>
      </section>

      {reviews.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <EmptyState icon="star" title={t("empty")} />
        </div>
      ) : (
        <Reviews reviews={reviews} heading={false} />
      )}
    </main>
  );
}
