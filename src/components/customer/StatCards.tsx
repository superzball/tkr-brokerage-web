import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useBaht } from "@/lib/format";
import { CUSTOMER_STATS } from "@/config/customer";

export function StatCards() {
  const t = useTranslations("customer.stats");
  const baht = useBaht();

  const cards: Array<{
    key: "active" | "expiring" | "premium" | "documents";
    icon: IconName;
    cls: string;
    value: string;
  }> = [
    { key: "active", icon: "shieldCheck", cls: "bg-mint-50 text-mint-600", value: String(CUSTOMER_STATS.active) },
    { key: "expiring", icon: "clock", cls: "bg-amber-50 text-amber-600", value: String(CUSTOMER_STATS.expiring) },
    { key: "premium", icon: "coins", cls: "bg-sky-100 text-brand-600", value: baht(CUSTOMER_STATS.premium) },
    { key: "documents", icon: "doc", cls: "bg-sky-100 text-brand-600", value: String(CUSTOMER_STATS.documents) },
  ];

  return (
    <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.key} className="card p-5 reveal">
          <span className={`w-9 h-9 rounded-lg inline-flex items-center justify-center ${c.cls}`}>
            <Icon name={c.icon} />
          </span>
          <p className="mt-3 font-display font-700 text-2xl text-ink-900 tabnum">
            {c.value}
          </p>
          <p className="text-sm text-ink-500">{t(c.key)}</p>
        </div>
      ))}
    </div>
  );
}
