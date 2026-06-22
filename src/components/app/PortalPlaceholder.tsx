// src/components/app/PortalPlaceholder.tsx
// Phase-7 scaffold for app routes whose real screens land in Phases 9–13.
// Enforces the role guard, then shows the page header + a "coming soon" body
// so every sidebar link is reachable now. The caller passes the (literal-key)
// title so typed-message keys stay statically checked.

import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";
import { Forbidden } from "./Forbidden";

export async function PortalPlaceholder({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  const user = await getSession();
  if (!user) return null; // layout already redirects anonymous hits
  if (!roleCanAccess(user.role, href)) return <Forbidden />;

  const t = await getTranslations("app.comingSoon");
  return (
    <>
      <PageHeader title={title} />
      <EmptyState icon="sparkle" title={t("title")} body={t("body")} />
    </>
  );
}
