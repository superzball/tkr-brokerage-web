import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { LineChatWidget } from "@/components/conversion/LineChatWidget";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Public marketing shell: the existing Navbar + Footer wrap every page in the
 * `(marketing)` route group (home, products, the demo apps). The authenticated
 * `(app)` group gets its own shell instead.
 */
export default async function MarketingLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <RevealObserver />
      <LineChatWidget />
    </>
  );
}
