"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "logout" }),
      });

      if (!response.ok) {
        setError("Unable to sign out.");
        return;
      }

      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      <Button disabled={isPending} type="button" variant="secondary" onClick={handleLogout}>
        {isPending ? "Signing Out..." : "Logout"}
      </Button>
    </div>
  );
}
