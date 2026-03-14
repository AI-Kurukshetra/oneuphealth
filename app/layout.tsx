import Link from "next/link";
import type { PropsWithChildren } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getNavigationSession } from "@/lib/auth/session";

import "./globals.css";

const appNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/providers", label: "Providers" },
  { href: "/organizations", label: "Organizations" },
  { href: "/consent", label: "Consent" },
  { href: "/analytics", label: "Analytics" },
  { href: "/developer", label: "Developer" },
];

const publicNavigation = [
  { href: "/", label: "Home" },
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
  const navigation = session.isAuthenticated ? appNavigation : publicNavigation;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen">
          <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
                  HP
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                    Health Platform
                  </p>
                  <p className="text-lg font-semibold text-ink">Interoperability Cloud</p>
                </div>
              </Link>
              <nav className="flex flex-wrap items-center gap-2 lg:justify-center">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                {session.isAuthenticated ? (
                  <>
                    <span className="rounded-full bg-accentSoft px-4 py-2 text-sm font-semibold text-accent">
                      Signed in
                    </span>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Request Access
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
