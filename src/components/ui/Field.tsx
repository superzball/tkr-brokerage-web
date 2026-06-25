import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/** `.field-label` from brand.css */
export function FieldLabel({
  className,
  children,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("field-label", className)} {...rest}>
      {children}
    </label>
  );
}

/**
 * `.field` text input. Optional, backward-compatible extras (Phase 19):
 *  - `error` toggles the semantic invalid ring (sets aria-invalid).
 *  - `prefix` renders a fixed unit affix (e.g. ฿) inside the field.
 */
export function TextField({
  className,
  error,
  prefix,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  prefix?: ReactNode;
}) {
  const input = (
    <input
      className={cn("field", className)}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
  if (prefix == null) return input;
  return (
    <span className="field-affixed">
      <span className="field-affix" aria-hidden="true">
        {prefix}
      </span>
      {input}
    </span>
  );
}

/** `select.field`. Optional `error` toggles the invalid ring (Phase 19). */
export function SelectField({
  className,
  error,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <select
      className={cn("field", className)}
      aria-invalid={error || undefined}
      {...rest}
    >
      {children}
    </select>
  );
}

/** Helper / error message under a control. `error` recolours it. */
export function FieldHelp({
  error,
  className,
  children,
}: {
  error?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("field-help", className)} data-error={error || undefined}>
      {children}
    </p>
  );
}

/**
 * Composite field: label + control + helper/error message. The control is
 * passed as children (TextField / SelectField / etc.), keeping one styling
 * source. Additive — existing call sites can keep composing the parts by hand.
 */
export function FormField({
  label,
  htmlFor,
  helper,
  error,
  className,
  children,
}: {
  label?: ReactNode;
  htmlFor?: string;
  /** Shown under the control; styled as an error message when `error` is set. */
  helper?: ReactNode;
  error?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label != null && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
      {children}
      {helper != null && <FieldHelp error={error}>{helper}</FieldHelp>}
    </div>
  );
}
