import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BusinessOnboarding } from "@/components/auth/onboarding/BusinessOnboarding";

type Props = { params: Promise<{ locale: Locale }> };

export default async function BusinessOnboardingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BusinessOnboarding />;
}
