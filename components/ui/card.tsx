import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-3xl border border-line bg-white shadow-card", className)}>
      {children}
    </div>
  );
}
