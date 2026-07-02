import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { WorkerPageHead } from "@/components/worker/WorkerPageHead";
import { WorkerFlow } from "@/components/worker/WorkerFlow";
import { WorkerFaq } from "@/components/worker/WorkerFaq";

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
  const t = await getTranslations({ locale, namespace: "worker.faq" });
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

      {/* public FAQ (customer-supplied) — same list also surfaces in /help */}
      <section id="faq" className="border-t border-ink-100/70 bg-sky-50/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight text-center">
            {t("title")}
          </h2>
          <p className="mt-2 text-ink-600 text-center">{t("sub")}</p>
          <div className="mt-8">
            <WorkerFaq />
          </div>
        </div>
      </section>
    </main>
  );
}
