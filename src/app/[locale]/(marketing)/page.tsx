import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/home/ProductGrid";
import { WhyTKR } from "@/components/home/WhyTKR";
import { TrustStats } from "@/components/home/TrustStats";
import { Faq } from "@/components/home/Faq";
import { AgentCTA } from "@/components/home/AgentCTA";
import { HomeArticles } from "@/components/home/HomeArticles";
import { Reviews } from "@/components/conversion/Reviews";
import { TrustCredentials } from "@/components/conversion/TrustCredentials";
import { QuickRenew } from "@/components/conversion/QuickRenew";
import { getReviews } from "@/lib/mock/seed";
import { getArticles } from "@/lib/articles";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      {/* white */}
      <ProductGrid />
      {/* white — structure (asymmetric copy + live steps panel) carries it, no tint */}
      <WhyTKR />
      {/* contained soft-blue stats panel — featured gold figure + stat cards */}
      <TrustStats />
      {/* white — social proof: featured = the 3 service-focused quotes cleared for home */}
      <Reviews reviews={getReviews({ featuredOnly: true })} />
      {/* one restrained soft-blue band breaks the white rhythm before the dark anchor */}
      <div className="sec-soft">
        <Faq />
      </div>
      {/* white — บทความ preview: the 3 newest SEO articles from the file CMS */}
      <HomeArticles articles={getArticles({ publishedOnly: true }).slice(0, 3)} />
      {/* dark band — OIC license + partner wall (no fabricated awards).
          `home-credentials` hides the two stat cells that duplicate the headline
          numbers above (customers 12,800 + insurers count) — home only; other
          routes render the full set. */}
      <div className="home-credentials">
        <TrustCredentials />
      </div>
      {/* offset gold highlight band — straddles the dark section above */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 -mt-12 lg:-mt-16 pb-4">
        <QuickRenew className="shadow-pop" />
      </section>
      {/* <AgentCTA /> */}
    </main>
  );
}
