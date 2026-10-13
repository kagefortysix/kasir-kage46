"use client";

import React from "react";
import { usePosStore } from "@/store/usePosStore";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePosStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        let bgClass = "bg-slate-900 text-white dark:bg-white dark:text-slate-900";
        let Icon = Info;

        if (toast.type === "success") {
          bgClass = "bg-emerald-600 text-white dark:bg-emerald-500";
          Icon = CheckCircle2;
        } else if (toast.type === "error") {
          bgClass = "bg-rose-600 text-white dark:bg-rose-500";
          Icon = AlertCircle;
        } else if (toast.type === "warning") {
          bgClass = "bg-amber-600 text-white dark:bg-amber-500";
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-2 duration-200 ${bgClass}`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 opacity-70 hover:opacity-100 transition"
              aria-label="Tutup notifikasi"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
