"use client";

import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "error";
};

const ToastContext = createContext<{ toast: (toast: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const value = useMemo(
    () => ({
      toast: (toast: Omit<Toast, "id">) => {
        const id = Date.now();
        setToasts((current) => [...current, { ...toast, id }]);
        window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4200);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] grid w-full max-w-sm gap-3">
        {toasts.map((toast) => {
          const Icon = toast.variant === "error" ? XCircle : CheckCircle2;
          return (
            <div key={toast.id} className={cn("glass-panel rounded-lg p-4 shadow-panel", toast.variant === "error" && "border-red-400/40")}>
              <div className="flex gap-3">
                <Icon className={cn("mt-0.5 h-5 w-5 text-emerald-300", toast.variant === "error" && "text-red-300")} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm text-slate-400">{toast.description}</p> : null}
                </div>
                <button type="button" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}>
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
