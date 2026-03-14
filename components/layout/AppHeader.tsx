"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/domain";

type NavigationItem = {
  href: string;
  label: string;
};

type HeaderSession = {
  isAuthenticated: boolean;
  userId: string | null;
  role: UserRole | null;
  fullName: string | null;
  email: string | null;
};

interface AppHeaderProps {
  navigation: NavigationItem[];
  session: HeaderSession;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href.includes("#")) {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader({ navigation, session }: AppHeaderProps) {
  const pathname = usePathname();
  const displayName = session.fullName || session.email?.split("@")[0] || "Signed in user";

  return (
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
          {navigation.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-ink text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
                    : "text-slate-600 hover:bg-white hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {session.isAuthenticated ? (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-line bg-white px-4 py-2.5 text-left shadow-sm marker:hidden">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    {session.role ?? "user"}
                  </p>
                </div>
                <span className="text-xs text-slate-400">▾</span>
              </summary>
              <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-line bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{displayName}</p>
                  {session.email ? (
                    <p className="mt-1 break-all text-sm text-slate-500">{session.email}</p>
                  ) : null}
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-accent">
                    Signed in as {session.role ?? "user"}
                  </p>
                </div>
                <div className="mt-4">
                  <LogoutButton className="w-full justify-center" />
                </div>
              </div>
            </details>
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
  );
}
