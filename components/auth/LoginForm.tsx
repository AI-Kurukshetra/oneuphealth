"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const defaultCredentials = {
  email: "admin@northwind-health.test",
  password: "Admin123!@#",
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(defaultCredentials.email);
  const [password, setPassword] = useState(defaultCredentials.password);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email,
          password,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;

      if (!response.ok) {
        setError(payload?.error?.message ?? "Unable to sign in.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <Input
        autoComplete="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        type="email"
        value={email}
      />
      <Input
        autoComplete="current-password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        type="password"
        value={password}
      />
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      <Button className="w-full py-3" disabled={isPending} type="submit">
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
