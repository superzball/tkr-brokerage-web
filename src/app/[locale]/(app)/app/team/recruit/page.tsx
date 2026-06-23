import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { RecruitClient } from "@/components/app/team/RecruitClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function RecruitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/team/recruit")) return <Forbidden />;

  const t = await getTranslations("team");

  return (
    <>
      <PageHeader title={t("recruit.title")} description={t("recruit.desc")} />
      <RecruitClient />
    </>
  );
}
