import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68706b] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[rgba(17,20,18,0.12)] bg-white px-3.5 py-2 text-sm text-[#111412] placeholder:text-[#68706b]/60 transition-all duration-150 focus:border-[#16834b] focus:outline-none focus:ring-2 focus:ring-[#16834b]/15 disabled:cursor-not-allowed disabled:bg-[#f7f8f7] disabled:opacity-50",
            icon && "pl-10",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
