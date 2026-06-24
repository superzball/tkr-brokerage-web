import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { TicketDetailView } from "@/components/app/admin/TicketDetailView";
import { getTicket, getCreditLedger, crmCustomers } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale; id: string }> };

export default async function TicketDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;

  // Seed tickets resolve server-side; locally-created tickets resolve client-side.
  const seedTicket = getTicket(id) ?? null;

  return (
    <TicketDetailView
      id={id}
      seedTicket={seedTicket}
      seedLedger={getCreditLedger()}
      customers={crmCustomers()}
    />
  );
}
