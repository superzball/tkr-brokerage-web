import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { SeoClient } from "@/components/app/admin/SeoClient";
import { getCmsPages, getRedirects } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function SeoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "content")) return <AdminForbidden />;

  const t = await getTranslations("admin.seo");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <SeoClient pages={getCmsPages()} redirects={getRedirects()} />
    </>
  );
}
