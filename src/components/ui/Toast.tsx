"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "loading";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    
    if (toast.duration !== 0 && toast.type !== "loading") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 4000);
    }
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  if (toasts.length === 0) return null;

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-[#34D399]" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      case "info":
        return <Info className="w-5 h-5 text-[#FF5500]" />;
      case "loading":
        return <Loader2 className="w-5 h-5 text-[#FF5500] animate-spin" />;
    }
  };

  const getBorderColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "border-[#34D399]/50";
      case "error":
        return "border-[#EF4444]/50";
      case "info":
        return "border-[#FF5500]/50";
      case "loading":
        return "border-[#FF5500]/50";
    }
  };

  const getBgColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-[#0A1A0A]";
      case "error":
        return "bg-[#1A0A0A]";
      case "info":
        return "bg-[#1A120A]";
      case "loading":
        return "bg-[#1A120A]";
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto ${getBgColor(toast.type)} border ${getBorderColor(toast.type)} px-4 py-3 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl min-w-[280px] max-w-[400px] animate-in slide-in-from-right duration-300 font-matrix`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-orbitron text-[11px] font-semibold text-white tracking-wider">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-[12px] text-neutral-300 font-matrix mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => onClose(toast.id)}
              className="flex-shrink-0 p-1 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Convenience hooks
export function useToastHelpers() {
  const { showToast, hideToast } = useToast();
  
  return {
    success: (title: string, message?: string, duration?: number) => 
      showToast({ type: "success", title, message, duration }),
    error: (title: string, message?: string, duration?: number) => 
      showToast({ type: "error", title, message, duration }),
    info: (title: string, message?: string, duration?: number) => 
      showToast({ type: "info", title, message, duration }),
    loading: (title: string, message?: string) => 
      showToast({ type: "loading", title, message, duration: 0 }),
    dismiss: hideToast,
  };
}