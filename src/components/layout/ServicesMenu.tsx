import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SERVICE_MENU } from "@/config/nav";
import { cn } from "@/lib/cn";

/** "บริการดิจิทัล" hover dropdown (CSS-only, group/svc). */
export function ServicesMenu({ active }: { active: boolean }) {
  const t = useTranslations("nav");
  return (
    <div className="relative group/svc">
      <button
        className={cn("nav-link inline-flex items-center gap-1", active && "active")}
      >
        {t("services")}
        <Icon
          name="chevD"
          size={14}
          strokeWidth={2.4}
          className="transition-transform group-hover/svc:rotate-180"
        />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover/svc:opacity-100 group-hover/svc:visible group-hover/svc:translate-y-0 transition-all duration-200 z-50">
        <div className="w-[300px] card p-2.5">
          {SERVICE_MENU.map((item) => (
            <AppLink
              key={item.key}
              href={item.href}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-100 transition-colors"
            >
              <span className="mt-0.5 inline-flex w-9 h-9 rounded-lg items-center justify-center bg-sky-100 text-brand-600 shrink-0">
                <Icon name={item.icon} />
              </span>
              <span>
                <span className="block text-sm font-600 text-ink-900">
                  {t(`service.${item.key}.title`)}
                </span>
                <span className="block text-xs text-ink-500 mt-0.5">
                  {t(`service.${item.key}.desc`)}
                </span>
              </span>
            </AppLink>
          ))}
        </div>
      </div>
    </div>
  );
}
