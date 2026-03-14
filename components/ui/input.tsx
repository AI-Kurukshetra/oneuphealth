import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400",
        props.className,
      )}
      {...props}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400",
        props.className,
      )}
      {...props}
    />
  );
}
