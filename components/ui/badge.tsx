import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps extends PropsWithChildren {
  tone?: "default" | "success" | "warning";
}

export function Badge({ tone = "default", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        tone === "success" && "bg-emerald-100 text-emerald-800",
        tone === "warning" && "bg-orange-100 text-orange-800",
        tone === "default" && "bg-slate-100 text-slate-700",
      )}
    >
      {children}
    </span>
  );
}
