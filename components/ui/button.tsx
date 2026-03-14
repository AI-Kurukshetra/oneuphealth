import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps
  extends PropsWithChildren,
    ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-ink text-white hover:bg-slate-900"
          : "bg-accentSoft text-accent hover:bg-cyan-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
