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
      {/* soft MINT band */}
      <div className="bg-gradient-to-b from-mint-50/80 to-white">
        <WhyTKR />
      </div>
      {/* dark band — animated stats */}
      <TrustStats />
      {/* white */}
      <Reviews reviews={getReviews()} limit={3} />
      {/* soft GOLD/PEACH band */}
      <div className="bg-gradient-to-b from-gold-50/90 to-white">
        <Faq />
      </div>
      {/* dark band — OIC license + partners (no fabricated awards) */}
      <TrustCredentials />
      {/* standout promo strip + agent CTA on white */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-4">
        <QuickRenew />
      </section>
      <AgentCTA />
    </main>
  );
}
