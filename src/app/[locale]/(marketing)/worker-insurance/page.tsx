import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { WorkerPageHead } from "@/components/worker/WorkerPageHead";
import { WorkerFlow } from "@/components/worker/WorkerFlow";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.worker" });
  return { title: t("title"), description: t("description") };
}

export default async function WorkerInsurancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSession();
  // Only a REAL full account skips the phone-verify step. A silent guest
  // session (status "guest", left by a prior guest checkout) must still verify
  // its phone before payment — otherwise the lingering session cookie would
  // silently skip identity capture on a repeat visit.
  const fullAccount = !!user && user.status !== "guest";

  return (
    <main>
      <WorkerPageHead />
      <WorkerFlow authed={fullAccount} />
    </main>
  );
}
