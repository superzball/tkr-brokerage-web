import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { OtpForm } from "@/components/auth/OtpForm";
import type { Role } from "@/types/portal";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ phone?: string; purpose?: string; role?: string; next?: string }>;
};

const ROLES: Role[] = ["business", "individual", "agent"];

export default async function VerifyOtpPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { phone, purpose, role, next } = await searchParams;
  // No phone in the flow → start over at login.
  if (!phone) redirect({ href: "/login", locale });

  const validPurpose = purpose === "signup" ? "signup" : "login";
  const validRole = role && ROLES.includes(role as Role) ? (role as Role) : undefined;

  return (
    <OtpForm phone={phone ?? ""} purpose={validPurpose} role={validRole} next={next} />
  );
}
