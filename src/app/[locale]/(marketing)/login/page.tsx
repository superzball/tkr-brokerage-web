import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app.login" });
  return { title: t("title") };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-hero min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  );
}
