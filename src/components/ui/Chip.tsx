import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ChipProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Rounded pill (.chip). Color/background are passed via className at the call
 * site, exactly as in the original markup (e.g. `bg-brand-50 text-brand-600`).
 */
export function Chip({ className, children, ...rest }: ChipProps) {
  return (
    <span className={cn("chip", className)} {...rest}>
      {children}
    </span>
  );
}
