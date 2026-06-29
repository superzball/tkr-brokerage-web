import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LegalShell, LegalSections } from "@/components/legal/LegalShell";
import { getLegalPolicies, currentPolicyVersion } from "@/lib/mock/seed";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.legalTerms" });
  return { title: t("title"), description: t("description") };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const version = currentPolicyVersion("terms");
  const policy = getLegalPolicies().find((p) => p.kind === "terms" && p.version === version);
  const cms = cmsCopy("/legal/terms", locale);
  const intro = cms?.body ?? t("terms.intro");
  const sections = t.raw("terms.sections") as { h: string; b: string[] }[];

  return (
    <LegalShell
      active="terms"
      title={t("terms.title")}
      version={version}
      effectiveDate={policy?.effectiveDate}
      updatedAt={policy?.effectiveDate}
    >
      <p className="text-lg text-ink-700 leading-relaxed font-500">{intro}</p>
      <LegalSections sections={sections} />
    </LegalShell>
  );
}
