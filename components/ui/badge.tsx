import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "neutral" | "warning" | "outline" | "brand";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: "bg-[#e8f5ee] text-[#0d6338] border border-[#16834b]/20",
    neutral: "bg-[#f2f4f2] text-[#4a524e] border border-[rgba(17,20,18,0.06)]",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/60",
    outline: "bg-white text-[#111412] border border-[rgba(17,20,18,0.14)]",
    brand: "bg-[#16834b] text-white border-transparent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] font-medium tracking-tight rounded-md",
    md: "px-2.5 py-1 text-xs font-medium tracking-tight rounded-lg",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
