import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getClients } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { ClientsTable } from "@/components/app/agent/ClientsTable";

type Props = { params: Promise<{ locale: Locale }> };

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/clients")) return <Forbidden />;

  const t = await getTranslations("agent");
  const clients = getClients();

  return (
    <>
      <PageHeader title={t("clients.title")} description={t("clients.desc")} />
      <ClientsTable clients={clients} />
    </>
  );
}
