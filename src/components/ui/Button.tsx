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
  /** Shows a spinner, marks aria-busy, and blocks interaction. Optional —
   *  existing call sites are unaffected. */
  loading?: boolean;
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
 * a plain anchor for `#`/external hrefs, or a <button> otherwise. Styling reads
 * the semantic --ui-* tokens, so it adapts to the friendly/premium zone.
 */
export function Button(props: ButtonProps) {
  const loading = props.loading ?? false;
  const cls = cn(
    "btn",
    VARIANT[props.variant ?? "primary"],
    SIZE[props.size ?? "md"],
    props.className,
  );

  const content = (
    <>
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {props.children}
    </>
  );

  if (props.href !== undefined) {
    const {
      variant: _v,
      size: _s,
      loading: _l,
      className: _c,
      href,
      children: _ch,
      ...rest
    } = props;
    const linkProps = {
      className: cn(cls, loading && "pointer-events-none"),
      "data-loading": loading || undefined,
      "aria-busy": loading || undefined,
      "aria-disabled": loading || undefined,
      ...rest,
    };
    return isInternal(href) ? (
      <Link href={href} {...linkProps}>
        {content}
      </Link>
    ) : (
      <a href={href} {...linkProps}>
        {content}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    loading: _l,
    className: _c,
    href: _h,
    children: _ch,
    disabled,
    ...rest
  } = props;
  return (
    <button
      className={cls}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
}
