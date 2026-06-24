import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { TicketCheckClient } from "@/components/app/public/TicketCheckClient";
import { getTicketByNumber, getIssuedPolicies } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale; ticketNumber: string }> };

// Public, unauthenticated status page. Resolves the seed ticket server-side;
// locally-created tickets resolve client-side from localStorage. The 6-digit
// customerCode gate (rate-limited) reveals detail + issued-policy downloads.
export default async function TicketCheckPage({ params }: Props) {
  const { locale, ticketNumber } = await params;
  setRequestLocale(locale);
  const ticket = getTicketByNumber(ticketNumber) ?? null;
  return (
    <TicketCheckClient
      ticketNumber={ticketNumber}
      seedTicket={ticket}
      seedIssued={ticket ? getIssuedPolicies(ticket.id) : []}
    />
  );
}
