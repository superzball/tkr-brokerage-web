import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

/** Centered max-width wrapper used across the site (max-w-7xl + responsive px). */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cn("max-w-7xl mx-auto px-4 sm:px-6", className)}>
      {children}
    </Tag>
  );
}
