import type { PropsWithChildren } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { getNavigationSession } from "@/lib/auth/session";
import type { UserRole } from "@/types/domain";

import "./globals.css";

const appNavigation = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "provider", "developer", "payer"] },
  { href: "/patients", label: "Patients", roles: ["admin", "provider"] },
  { href: "/providers", label: "Providers", roles: ["admin", "provider"] },
  { href: "/organizations", label: "Organizations", roles: ["admin"] },
  { href: "/consent", label: "Consent", roles: ["admin", "provider"] },
  { href: "/analytics", label: "Analytics", roles: ["admin", "provider", "developer", "payer"] },
  { href: "/developer", label: "Developer", roles: ["admin", "developer"] },
] satisfies Array<{ href: string; label: string; roles: UserRole[] }>;

const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#platform", label: "Platform" },
  { href: "/#security", label: "Security" },
  { href: "/#developer", label: "Developer APIs" },
];

export const metadata = {
  title: "Health Platform",
  description: "FHIR R4 healthcare interoperability platform",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getNavigationSession();
  const role = session.role;
  const navigation =
    session.isAuthenticated && role
      ? appNavigation.filter((item) => item.roles.includes(role)).map(({ href, label }) => ({ href, label }))
      : publicNavigation;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen">
          <AppHeader navigation={navigation} session={session} />
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
