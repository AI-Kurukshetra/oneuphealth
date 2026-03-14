import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <Card className="w-full max-w-md p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          Secure Access
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Login</h2>
        <p className="mt-3 text-sm text-slate-600">
          Sign in with the seeded Supabase Auth users or replace these credentials with your
          own project users.
        </p>
        <LoginForm />
      </Card>
    </div>
  );
}
