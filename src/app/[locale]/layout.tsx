import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Pre-render every locale at build time (static rendering). */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  // Per-page localized title/description land in Phase 5 (generateMetadata).
  title: "TKR",
  icons: { icon: "/logo-tkr.png" },
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
