import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getAgentSales } from "@/lib/mock/seed";
import { Forbidden } from "@/components/app/Forbidden";
import { SaleDetailView } from "@/components/app/agent/SaleDetailView";

type Props = { params: Promise<{ locale: Locale; id: string }> };

export default async function SaleDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/sales")) return <Forbidden />;

  // Seed sales resolve server-side; on-behalf (local) sales resolve client-side.
  const seedSale = getAgentSales().find((s) => s.id === id) ?? null;

  return <SaleDetailView id={id} seedSale={seedSale} />;
}
