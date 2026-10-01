"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111412]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white border border-[rgba(17,20,18,0.1)] p-6 shadow-2xl transition-all duration-200 z-10 my-auto",
          maxWidths[maxWidth],
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#68706b] hover:bg-[#f7f8f7] hover:text-[#111412] transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {(title || description) && (
          <div className="mb-4 pr-6">
            {title && (
              <h2 className="text-xl font-semibold tracking-tight text-[#111412]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#68706b]">{description}</p>
            )}
          </div>
        )}

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
