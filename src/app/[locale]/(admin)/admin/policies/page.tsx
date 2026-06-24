import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { PoliciesAdminClient } from "@/components/app/admin/PoliciesAdminClient";
import { getAllPolicies } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function AdminPoliciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;

  const t = await getTranslations("admin.policies");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <PoliciesAdminClient initial={getAllPolicies()} />
    </>
  );
}
