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
 * Focused auth shell (login, signup, OTP, password reset, onboarding): brand
 * header + centered content on the hero backdrop. No marketing nav/footer.
 */
export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        <Logo />
        <LocaleSwitcher />
      </header>
      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
