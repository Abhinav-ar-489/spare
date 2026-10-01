import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const variants = {
      primary:
        "bg-[#16834b] text-white hover:bg-[#0d6338] shadow-sm hover:shadow focus-visible:ring-[#16834b]",
      secondary:
        "bg-[#f0f8f4] text-[#0d6338] hover:bg-[#e8f5ee] border border-[#16834b]/15 focus-visible:ring-[#16834b]",
      outline:
        "border border-[rgba(17,20,18,0.12)] bg-white text-[#111412] hover:bg-[#f7f8f7] hover:border-[rgba(17,20,18,0.2)] focus-visible:ring-[#16834b]",
      ghost:
        "text-[#111412] hover:bg-[#f7f8f7] hover:text-[#16834b] focus-visible:ring-[#16834b]",
      glass:
        "bg-white/80 backdrop-blur-md border border-white/40 text-[#111412] shadow-sm hover:bg-white hover:border-[rgba(17,20,18,0.1)] focus-visible:ring-[#16834b]",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
