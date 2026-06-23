import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SignupForm } from "@/components/auth/SignupForm";
import type { Role } from "@/types/portal";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ role?: string }>;
};

const ROLES: Role[] = ["business", "individual", "agent"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.signup" });
  return { title: t("title") };
}

export default async function SignupPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { role } = await searchParams;
  setRequestLocale(locale);
  const initialRole = role && ROLES.includes(role as Role) ? (role as Role) : undefined;
  return <SignupForm initialRole={initialRole} />;
}
