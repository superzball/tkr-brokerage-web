// Catch-all for any unmatched path under a locale (e.g. /th/does-not-exist).
// Sets the request locale so the not-found boundary renders translated, then
// triggers it. With localePrefix:"always", the middleware prefixes a locale
// onto unknown paths, so this catches them all and shows the custom 404.

import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return [];
}

export default async function CatchAll({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;
  if (hasLocale(routing.locales, locale)) {
    setRequestLocale(locale as Locale);
  }
  notFound();
}
