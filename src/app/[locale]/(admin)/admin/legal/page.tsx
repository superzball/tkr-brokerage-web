import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { LegalAdminClient } from "@/components/app/admin/LegalAdminClient";
import { getLegalPolicies, getConsents, getDataRequests } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function LegalAdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "superadmin")) return <AdminForbidden />;

  const t = await getTranslations("admin.legal");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <LegalAdminClient
        policies={getLegalPolicies()}
        consents={getConsents()}
        requests={getDataRequests()}
      />
    </>
  );
}
