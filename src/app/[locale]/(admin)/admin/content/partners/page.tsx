import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { PartnersClient } from "@/components/app/admin/PartnersClient";
import { getInsurerPartners } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "content")) return <AdminForbidden />;

  const t = await getTranslations("admin.partners");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <PartnersClient initial={getInsurerPartners()} />
    </>
  );
}
