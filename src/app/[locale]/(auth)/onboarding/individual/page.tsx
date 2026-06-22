import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { IndividualOnboarding } from "@/components/auth/onboarding/IndividualOnboarding";

type Props = { params: Promise<{ locale: Locale }> };

export default async function IndividualOnboardingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <IndividualOnboarding />;
}
