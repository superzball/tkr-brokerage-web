import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: Locale }> };

const FAQ = ["q1", "q2", "q3", "q4"] as const;

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/help")) return <Forbidden />;

  const t = await getTranslations("business");
  // FAQ copy is role-specific; the contact card is shared.
  const ti = await getTranslations("individual");
  const faq =
    user.role === "individual"
      ? FAQ.map((q) => ({
          q: ti(`help.faq.${q}`),
          a: ti(`help.faq.${q.replace("q", "a") as "a1" | "a2" | "a3" | "a4"}`),
        }))
      : FAQ.map((q) => ({
          q: t(`help.faq.${q}`),
          a: t(`help.faq.${q.replace("q", "a") as "a1" | "a2" | "a3" | "a4"}`),
        }));

  return (
    <>
      <PageHeader title={t("help.title")} description={t("help.desc")} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* FAQ */}
        <section className="lg:col-span-2 card p-6">
          <h2 className="font-700 text-ink-900 mb-4">{t("help.faqTitle")}</h2>
          <div className="divide-y divide-ink-50">
            {faq.map((item) => (
              <details key={item.q} className="group py-3">
                <summary className="flex cursor-pointer items-center justify-between gap-3 font-600 text-ink-900 list-none">
                  {item.q}
                  <Icon
                    name="chevD"
                    size={18}
                    className="text-ink-400 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="mt-2 text-sm text-ink-500">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* contact */}
        <section className="card p-6 h-fit">
          <span className="w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center mb-4">
            <Icon name="headset" size={24} />
          </span>
          <h2 className="font-700 text-ink-900">{t("help.contactTitle")}</h2>
          <p className="mt-1.5 text-sm text-ink-500">{t("help.contactDesc")}</p>
          <div className="mt-5 space-y-2.5">
            <Button href="tel:1234" variant="primary" size="md" className="w-full">
              <Icon name="phone" /> {t("help.call")}
            </Button>
            <Button href="#" variant="ghost" size="md" className="w-full">
              <Icon name="chat" /> {t("help.chat")}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
