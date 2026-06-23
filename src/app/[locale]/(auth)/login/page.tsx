import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ next?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login" });
  return { title: t("title") };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);
  return <LoginForm next={next} />;
}
