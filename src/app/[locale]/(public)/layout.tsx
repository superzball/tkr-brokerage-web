import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Logo } from "@/components/layout/Logo";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Public, unauthenticated token area (ticket status check + underwriter verify).
 * Lives OUTSIDE the (app)/(admin) auth groups — the proxy only guards /app and
 * /admin, so /{locale}/ticket/* is reachable without a session. Brand header +
 * locale switcher on the hero backdrop; no marketing nav/footer, no app shell.
 */
export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <header className="w-full max-w-3xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        <Logo />
        <LocaleSwitcher />
      </header>
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
