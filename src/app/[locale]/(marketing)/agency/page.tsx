import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AgencyHeader } from "@/components/agency/AgencyHeader";
import { AgencyStats } from "@/components/agency/AgencyStats";
import { SalesChart } from "@/components/agency/SalesChart";
import { NextRewardCard } from "@/components/agency/NextRewardCard";
import { TierSection } from "@/components/agency/TierSection";
import { IncentiveTrip } from "@/components/agency/IncentiveTrip";
import { Downline } from "@/components/agency/Downline";
import { ShareCard } from "@/components/agency/ShareCard";
import { MediaCard } from "@/components/agency/MediaCard";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.agency" });
  return { title: t("title"), description: t("description") };
}

export default async function AgencyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <AgencyHeader />
      <AgencyStats />
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <SalesChart />
        <NextRewardCard />
      </div>
      <TierSection />
      <IncentiveTrip />
      <section id="tools" className="mt-8 grid lg:grid-cols-3 gap-6">
        <Downline />
        <div className="space-y-6">
          <ShareCard />
          <MediaCard />
        </div>
      </section>
    </div>
  );
}
