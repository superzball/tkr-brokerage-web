import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { AgentsClient } from "@/components/app/admin/AgentsClient";
import { getDownline, getTeamOverrides } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function AgentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;

  const t = await getTranslations("admin.agents");

  // pre-aggregate override earned per member (by name, matching the seed)
  const overrides: Record<string, number> = {};
  for (const o of getTeamOverrides()) {
    overrides[o.sourceName] = (overrides[o.sourceName] ?? 0) + o.amount;
  }

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <AgentsClient initial={getDownline()} overrides={overrides} />
    </>
  );
}
