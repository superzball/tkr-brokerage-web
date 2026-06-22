// src/components/app/form.tsx
// The app form-field set: Field (label + error wrapper), Input, Select,
// DatePicker, FileUpload. Built on the .field / .field-label classes so they
// match the existing site forms. Client module (FileUpload holds state).

"use client";

import { useId, useState } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Label + optional hint/error around any control. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="field-label">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, id, ...rest }: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={fieldId}>
      <input
        id={fieldId}
        className={cn("field", error && "border-rose-400", className)}
        {...rest}
      />
    </Field>
  );
}

/** Native date input (a real date-picker library can replace this later). */
export function DatePicker(props: Omit<InputProps, "type">) {
  return <Input type="date" {...props} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Select({
  label,
  hint,
  error,
  className,
  id,
  children,
  ...rest
}: SelectProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={fieldId}>
      <select
        id={fieldId}
        className={cn("field", error && "border-rose-400", className)}
        {...rest}
      >
        {children}
      </select>
    </Field>
  );
}

/** Mock file picker with a selected-files preview (no upload happens). */
export function FileUpload({
  label,
  hint,
  accept,
  multiple = true,
  buttonLabel,
}: {
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  buttonLabel: string;
}) {
  const [files, setFiles] = useState<string[]>([]);
  const id = useId();

  return (
    <Field label={label} hint={hint}>
      <label htmlFor={id} className="dz block p-6 text-center cursor-pointer">
        <span className="inline-flex items-center gap-2 text-brand-600 font-600">
          <Icon name="upload" size={18} />
          {buttonLabel}
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) =>
            setFiles(Array.from(e.target.files ?? []).map((f) => f.name))
          }
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 text-sm text-ink-700"
            >
              <Icon name="file" size={16} className="text-ink-400" />
              {name}
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
