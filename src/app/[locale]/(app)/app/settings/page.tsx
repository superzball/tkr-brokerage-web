import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { SettingsClient } from "@/components/app/business/SettingsClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/settings")) return <Forbidden />;

  const t = await getTranslations("business");

  return (
    <>
      <PageHeader title={t("settings.title")} description={t("settings.desc")} />
      <SettingsClient
        variant={user.role === "business" ? "business" : "individual"}
        name={user.name}
        company={user.company}
        email={user.email ?? ""}
        phone={user.phone ?? ""}
      />
    </>
  );
}
