import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost" | "gold";
export type ButtonSize = "lg" | "md" | "sm";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  gold: "btn-gold",
};

const SIZE: Record<ButtonSize, string> = {
  lg: "btn-lg",
  md: "btn-md",
  sm: "btn-sm",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

type AsLink = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps
  >;
type AsButton = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps
  >;

export type ButtonProps = AsLink | AsButton;

/** Internal app routes get the locale-aware <Link>; `#` / external use a plain <a>. */
const isInternal = (href: string) => href.startsWith("/");

/**
 * Brand button. Renders a locale-aware link when `href` is an internal route,
 * a plain anchor for `#`/external hrefs, or a <button> otherwise.
 */
export function Button(props: ButtonProps) {
  const cls = cn(
    "btn",
    VARIANT[props.variant ?? "primary"],
    SIZE[props.size ?? "md"],
    props.className,
  );

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, href, children, ...rest } =
      props;
    return isInternal(href) ? (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    ) : (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, href: _h, children, ...rest } =
    props;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
