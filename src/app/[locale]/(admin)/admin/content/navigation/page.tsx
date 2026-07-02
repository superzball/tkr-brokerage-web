import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { NavigationClient } from "@/components/app/admin/NavigationClient";
import { getNavSettings } from "@/lib/mock/seed";
import {
  flattenActions,
  flattenFooter,
  flattenPublicNav,
} from "@/lib/nav-visibility";

type Props = { params: Promise<{ locale: Locale }> };

export default async function NavigationSettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "content")) return <AdminForbidden />;

  const t = await getTranslations("admin.navigation");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <NavigationClient
        entries={flattenPublicNav()}
        actions={flattenActions()}
        footer={flattenFooter()}
        seed={getNavSettings()}
      />
    </>
  );
}
