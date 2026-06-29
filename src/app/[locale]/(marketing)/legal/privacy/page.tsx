import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LegalShell, LegalSections } from "@/components/legal/LegalShell";
import { getLegalPolicies, currentPolicyVersion } from "@/lib/mock/seed";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.legalPrivacy" });
  return { title: t("title"), description: t("description") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const version = currentPolicyVersion("privacy");
  const policy = getLegalPolicies().find((p) => p.kind === "privacy" && p.version === version);
  // CMS-editable intro (Thai locale); other locales fall back to the catalog.
  const cms = cmsCopy("/legal/privacy", locale);
  const intro = cms?.body ?? t("privacy.intro");
  const sections = t.raw("privacy.sections") as { h: string; b: string[] }[];

  return (
    <LegalShell
      active="privacy"
      title={t("privacy.title")}
      version={version}
      effectiveDate={policy?.effectiveDate}
      updatedAt={policy?.effectiveDate}
    >
      <p className="text-lg text-ink-700 leading-relaxed font-500">{intro}</p>
      <LegalSections sections={sections} />
    </LegalShell>
  );
}
