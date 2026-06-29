import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/home/ProductGrid";
import { WhyTKR } from "@/components/home/WhyTKR";
import { TrustStats } from "@/components/home/TrustStats";
import { Faq } from "@/components/home/Faq";
import { AgentCTA } from "@/components/home/AgentCTA";
import { Reviews } from "@/components/conversion/Reviews";
import { TrustCredentials } from "@/components/conversion/TrustCredentials";
import { QuickRenew } from "@/components/conversion/QuickRenew";
import { getReviews } from "@/lib/mock/seed";

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
      {/* MINT band — layered tint, not flat */}
      <div className="sec-mint">
        <WhyTKR />
      </div>
      {/* dark band — featured stat + partner marquee */}
      <TrustStats />
      {/* PEACH band — social proof */}
      <div className="sec-peach">
        <Reviews reviews={getReviews()} limit={3} />
      </div>
      {/* GOLD band — FAQ */}
      <div className="sec-gold">
        <Faq />
      </div>
      {/* dark band — OIC license + partners (no fabricated awards) */}
      <TrustCredentials />
      {/* offset gold highlight band — straddles the dark section above */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 -mt-12 lg:-mt-16 pb-4">
        <QuickRenew className="shadow-pop" />
      </section>
      <AgentCTA />
    </main>
  );
}
