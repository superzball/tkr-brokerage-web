import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LegalShell, LegalSections } from "@/components/legal/LegalShell";
import { ManageCookiesLink } from "@/components/legal/ManageCookiesLink";
import { Icon } from "@/components/ui/Icon";
import { getLegalPolicies, currentPolicyVersion } from "@/lib/mock/seed";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.legalCookies" });
  return { title: t("title"), description: t("description") };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const version = currentPolicyVersion("cookies");
  const policy = getLegalPolicies().find((p) => p.kind === "cookies" && p.version === version);
  const cms = cmsCopy("/legal/cookies", locale);
  const intro = cms?.body ?? t("cookies.intro");
  const sections = t.raw("cookies.sections") as { h: string; b: string[] }[];

  return (
    <LegalShell
      active="cookies"
      title={t("cookies.title")}
      version={version}
      effectiveDate={policy?.effectiveDate}
      updatedAt={policy?.effectiveDate}
    >
      <p className="text-lg text-ink-700 leading-relaxed font-500">{intro}</p>
      <LegalSections sections={sections} />

      {/* reopen the cookie preferences manager */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-ink-600">{t("cookies.manageDesc")}</p>
        <ManageCookiesLink className="btn btn-primary btn-md shrink-0">
          <Icon name="shield" size={16} /> {t("cookies.manageCta")}
        </ManageCookiesLink>
      </div>
    </LegalShell>
  );
}
