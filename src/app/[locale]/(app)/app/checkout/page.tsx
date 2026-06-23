import { cookies } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { PENDING_QUOTE_COOKIE, decodePendingQuote } from "@/lib/quote/pending";
import { PageHeader } from "@/components/app/PageHeader";
import { CheckoutClient } from "@/components/app/CheckoutClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;

  const t = await getTranslations("checkout.page");
  const store = await cookies();
  const quote = decodePendingQuote(store.get(PENDING_QUOTE_COOKIE)?.value);

  return (
    <>
      <PageHeader title={t("title")} />
      <CheckoutClient quote={quote} />
    </>
  );
}
