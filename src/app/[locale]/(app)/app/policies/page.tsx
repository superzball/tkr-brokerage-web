import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getPolicies } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PoliciesTable } from "@/components/app/business/PoliciesTable";

type Props = { params: Promise<{ locale: Locale }> };

export default async function PoliciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/policies")) return <Forbidden />;

  const t = await getTranslations("business");
  const policies = getPolicies(user.id);

  return (
    <>
      <PageHeader
        title={t("policies.title")}
        description={t("policies.desc")}
        actions={
          <Button href="/app/buy" variant="primary" size="md">
            <Icon name="plus" /> {t("policies.buy")}
          </Button>
        }
      />
      <PoliciesTable
        policies={policies}
        showWorkers={user.role === "business"}
      />
    </>
  );
}
