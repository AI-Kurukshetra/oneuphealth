import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";

const seededUsers = [
  {
    email: "admin@northwind-health.test",
    password: "Admin123!@#",
    role: "Admin",
  },
  {
    email: "provider@northwind-health.test",
    password: "Provider123!@#",
    role: "Provider",
  },
];

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
        <div className="mt-8 rounded-[24px] border border-line bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Demo Credentials
          </p>
          <div className="mt-4 space-y-4">
            {seededUsers.map((user) => (
              <div key={user.email} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-ink">{user.role}</p>
                <p className="mt-2 break-all text-sm text-slate-600">
                  <span className="font-medium text-ink">Email:</span> {user.email}
                </p>
                <p className="mt-1 break-all text-sm text-slate-600">
                  <span className="font-medium text-ink">Password:</span> {user.password}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
