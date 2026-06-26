// src/components/app/toast.tsx
// Lightweight toast system: <ToastProvider> holds the stack, useToast() pushes
// messages, <Toaster> renders them (auto-dismiss). No external dependency.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "error" | "info";
type Toast = { id: number; message: string; tone: ToastTone };

type ToastApi = { toast: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastApi | null>(null);

const ICONS: Record<ToastTone, IconName> = {
  success: "checkCircle",
  error: "alert",
  info: "info",
};
const TONES: Record<ToastTone, string> = {
  success: "text-mint-600",
  error: "text-rose-600",
  info: "text-brand-600",
};
// Left accent stripe per tone (single semantic colour set).
const STRIPE: Record<ToastTone, string> = {
  success: "bg-mint-500",
  error: "bg-rose-500",
  info: "bg-brand-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = next.current++;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 w-80 max-w-[calc(100vw-2.5rem)]"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="card relative overflow-hidden p-3.5 pl-4 flex items-start gap-3 animate-fade-up"
          >
            <span
              className={cn("absolute left-0 top-0 bottom-0 w-1", STRIPE[t.tone])}
              aria-hidden="true"
            />
            <span className={cn("mt-0.5", TONES[t.tone])}>
              <Icon name={ICONS[t.tone]} size={18} />
            </span>
            <p className="text-sm text-ink-800 flex-1">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
