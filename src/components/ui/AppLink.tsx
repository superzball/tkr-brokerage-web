import type { AnchorHTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";

export type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/**
 * Renders a locale-aware <Link> for internal routes ("/..."), or a plain <a>
 * for "#" placeholders and external URLs. Use everywhere instead of importing
 * Link/`<a>` directly so locale prefixing stays consistent.
 */
export function AppLink({ href, children, ...rest }: AppLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
