import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Always import Link / useRouter /
 * usePathname / redirect / getPathname from here — never from "next/link"
 * or "next/navigation" — so the active locale prefix is preserved.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
