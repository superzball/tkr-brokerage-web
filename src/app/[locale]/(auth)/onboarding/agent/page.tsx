import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AgentOnboarding } from "@/components/auth/onboarding/AgentOnboarding";

type Props = { params: Promise<{ locale: Locale }> };

export default async function AgentOnboardingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AgentOnboarding />;
}
