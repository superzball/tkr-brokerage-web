import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getPolicies, getDocuments } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { DocumentsClient } from "@/components/app/business/DocumentsClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function DocumentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/documents")) return <Forbidden />;

  const t = await getTranslations("business");
  const policies = getPolicies(user.id);
  const documents = getDocuments(policies.map((p) => p.id));

  return (
    <>
      <PageHeader
        title={t("documents.title")}
        description={t("documents.desc")}
      />
      <DocumentsClient documents={documents} />
    </>
  );
}
