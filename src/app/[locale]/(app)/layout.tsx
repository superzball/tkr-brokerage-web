import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";
import { SessionProvider } from "@/lib/auth/SessionProvider";
import { ToastProvider } from "@/components/app/toast";
import { AppShell } from "@/components/app/AppShell";

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

  return (
    <SessionProvider user={user}>
      <ToastProvider>
        <AppShell role={user.role}>{children}</AppShell>
      </ToastProvider>
    </SessionProvider>
  );
}
