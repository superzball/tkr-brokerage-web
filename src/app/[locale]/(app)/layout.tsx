import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";
import { PENDING_QUOTE_COOKIE } from "@/lib/quote/pending";
import { SessionProvider } from "@/lib/auth/SessionProvider";
import { ToastProvider } from "@/components/app/toast";
import { AppShell } from "@/components/app/AppShell";
import { PendingQuoteBanner } from "@/components/app/PendingQuoteBanner";
import { GuestProfileBanner } from "@/components/app/GuestProfileBanner";
import { RevealObserver } from "@/components/RevealObserver";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Authenticated shell. The proxy already bounces anonymous hits to /login;
 * this re-checks server-side (defense in depth) and feeds the user into the
 * client session context + app shell.
 */
export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  const user = await getSession();
  if (!user) {
    redirect({ href: "/login", locale: locale as Locale });
    return null;
  }

  const store = await cookies();
  const hasPendingQuote = Boolean(store.get(PENDING_QUOTE_COOKIE)?.value);

  return (
    <SessionProvider user={user}>
      <ToastProvider>
        <RevealObserver />
        {hasPendingQuote && <PendingQuoteBanner />}
        {user.status === "guest" && <GuestProfileBanner />}
        <AppShell role={user.role}>{children}</AppShell>
      </ToastProvider>
    </SessionProvider>
  );
}
