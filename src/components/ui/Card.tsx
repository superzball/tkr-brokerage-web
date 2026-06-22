import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Adds the lift-on-hover transition (.card-hover). */
  hover?: boolean;
};

/** White rounded panel with the brand shadow (.card from brand.css). */
export function Card({ hover, className, children, ...rest }: CardProps) {
  return (
    <div className={cn("card", hover && "card-hover", className)} {...rest}>
      {children}
    </div>
  );
}
