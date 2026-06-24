import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { StaffVerifyClient } from "@/components/app/public/StaffVerifyClient";
import { getTicketByNumber } from "@/lib/mock/seed";

type Props = {
  params: Promise<{ locale: Locale; ticketNumber: string; token: string }>;
};

// Public, unauthenticated underwriter (Thip) hand-off form. The signed token in
// the URL is validated (mock) against the ticket's publicToken; on submit the
// ticket's thip fields + thipUpdatedAt are updated and an audit entry written.
export default async function StaffVerifyPage({ params }: Props) {
  const { locale, ticketNumber, token } = await params;
  setRequestLocale(locale);
  const ticket = getTicketByNumber(ticketNumber) ?? null;
  return (
    <StaffVerifyClient
      ticketNumber={ticketNumber}
      token={decodeURIComponent(token)}
      seedTicket={ticket}
    />
  );
}
