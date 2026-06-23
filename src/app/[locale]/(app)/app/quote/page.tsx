import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getClients } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { AgentQuote } from "@/components/app/agent/AgentQuote";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ client?: string }>;
};

export default async function QuotePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { client } = await searchParams;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/quote")) return <Forbidden />;

  const t = await getTranslations("agent");
  const clients = getClients().map((c) => ({ id: c.id, name: c.name }));

  return (
    <>
      <PageHeader title={t("quote.title")} description={t("quote.desc")} />
      <AgentQuote clients={clients} initialClientId={client} />
    </>
  );
}
