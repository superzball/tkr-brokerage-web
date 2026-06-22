import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

export type LogoProps = {
  src?: string;
  /** Tailwind height + width-auto, e.g. "h-11 w-auto". */
  imgClassName?: string;
  priority?: boolean;
};

/** TKR logo linking home (used in navbar + mobile drawer). */
export function Logo({
  src = site.logos.color,
  imgClassName = "h-11 w-auto",
  priority = false,
}: LogoProps) {
  const t = useTranslations("common");
  return (
    <Link
      href="/"
      className="flex items-center shrink-0 group"
      aria-label={t("brandAlt")}
    >
      <Image
        src={src}
        alt={t("brandAlt")}
        width={470}
        height={279}
        priority={priority}
        className={cn(
          imgClassName,
          "transition-transform duration-300 group-hover:scale-[1.03]",
        )}
      />
    </Link>
  );
}
