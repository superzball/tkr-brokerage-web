import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LegalShell } from "@/components/legal/LegalShell";
import { ConsentCenter } from "@/components/legal/ConsentCenter";
import { Icon } from "@/components/ui/Icon";
import { getSession } from "@/lib/auth/session";
import { getConsentState, currentPolicyVersion } from "@/lib/mock/seed";
import type { ConsentType } from "@/types/portal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.legalConsent" });
  return { title: t("title"), description: t("description") };
}

export default async function ConsentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const user = await getSession();

  return (
    <LegalShell active="consent" title={t("consent.title")}>
      <p className="text-lg text-ink-700 leading-relaxed font-500">{t("consent.intro")}</p>

      {!user ? (
        // Not signed in — the consent center needs an identity to act on.
        <div className="card p-7 text-center">
          <span className="mx-auto w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
            <Icon name="lock" size={22} />
          </span>
          <h2 className="mt-4 font-700 text-ink-900">{t("consent.loginTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-500 max-w-md mx-auto">{t("consent.loginDesc")}</p>
          <Link href="/login" className="btn btn-primary btn-md mt-5">
            {t("consent.loginCta")} <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      ) : (
        <ConsentCenter
          subjectId={user.id}
          seed={Object.fromEntries(
            Object.entries(getConsentState(user.id)).map(([k, v]) => [k, v.granted]),
          ) as Partial<Record<ConsentType, boolean>>}
          policyVersion={currentPolicyVersion("privacy")}
        />
      )}
    </LegalShell>
  );
}
