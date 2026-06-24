import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";
import { adminNavFor } from "@/lib/auth/rbac";
import { SessionProvider } from "@/lib/auth/SessionProvider";
import { ToastProvider } from "@/components/app/toast";
import { AdminShell } from "@/components/app/AdminShell";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Back-office shell (Phase 14). The proxy bounces anonymous /admin hits to
 * /login; this re-checks server-side, sends non-staff back to their own portal,
 * and renders the RBAC-filtered nav for the signed-in staff user.
 */
export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  const user = await getSession();
  if (!user) {
    redirect({ href: "/login", locale: locale as Locale });
    return null;
  }
  if (user.role !== "admin") {
    redirect({ href: "/app/dashboard", locale: locale as Locale });
    return null;
  }

  const sections = adminNavFor(user);

  return (
    <SessionProvider user={user}>
      <ToastProvider>
        <AdminShell sections={sections}>{children}</AdminShell>
      </ToastProvider>
    </SessionProvider>
  );
}
