"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type User = {
  name: string;
  role: "freelancer" | "employer";
};

const baseLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "⌂", roles: ["freelancer", "employer"] },
  { href: "/jobs", label: "Find work", icon: "⌕", roles: ["freelancer", "employer"] },
  { href: "/freelancers", label: "Talent", icon: "◎", roles: ["freelancer", "employer"] },
  { href: "/projects", label: "Projects", icon: "□", roles: ["freelancer", "employer"] },
  { href: "/analytics", label: "Analytics", icon: "↗", roles: ["freelancer", "employer"] },
  { href: "/profile", label: "Profile", icon: "●", roles: ["freelancer", "employer"] },
  { href: "/notifications", label: "Notifications", icon: "◇", roles: ["freelancer", "employer"] },
  { href: "/messages", label: "Messages", icon: "○", roles: ["freelancer", "employer"] },
];

const freelancerLinks = [
  { href: "/applications", label: "Applications", icon: "▣", roles: ["freelancer"] },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api<{ user: User }>("/auth/me")
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);

          const publicRoutes = [
            "/jobs",
            "/freelancers",
            "/analytics",
          ];

          const isPublicRoute = publicRoutes.some(
            (route) => pathname === route || pathname.startsWith(`${route}/`)
          );

          if (!isPublicRoute) {
            router.replace("/login");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingAuth(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  const links = useMemo(() => {
    if (!user) return baseLinks;
    const roleLinks = user.role === "freelancer" ? freelancerLinks : [];
    return [...baseLinks, ...roleLinks].filter((link) =>
      link.roles.includes(user.role)
    );
  }, [user]);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
  }

  if (checkingAuth && !user) {
    return (
      <main className="min-h-screen bg-[#0a0a0b] text-white">
        <div className="flex min-h-screen items-center justify-center text-sm text-white/30">
          Loading workspace...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0c0c0e] lg:flex lg:flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-white/[0.07] px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
              FP
            </div>
            <span className="font-semibold">Freelance Platform</span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {links.map((link) => {
              const active = isActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-white/[0.09] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  <span className="w-5 text-center text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user?.role === "employer" && (
              <Link
                href="/jobs/create"
                className="mt-4 flex items-center justify-center rounded-xl bg-white px-3 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                + Post a project
              </Link>
            )}
          </nav>

          <div className="border-t border-white/[0.07] p-4">
            <Link
              href="/profile"
              className="mb-3 block rounded-xl bg-white/[0.035] p-3 hover:bg-white/[0.05]"
            >
              <p className="truncate text-sm font-medium">
                {user?.name || "Account"}
              </p>
              <p className="mt-1 text-xs capitalize text-white/30">
                {user?.role || "guest"}
              </p>
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/40 hover:bg-white/[0.04] hover:text-white"
              >
                ↪ Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full rounded-xl px-3 py-2.5 text-sm text-white/40 hover:bg-white/[0.04] hover:text-white"
              >
                → Sign in
              </Link>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1 pb-20 lg:pb-0">
          <header className="flex h-20 items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
            <div>
              <p className="text-xs text-white/30">
                {user?.role === "employer"
                  ? "Employer workspace"
                  : user?.role === "freelancer"
                    ? "Freelancer workspace"
                    : "Marketplace"}
              </p>
              <p className="mt-0.5 text-sm font-medium text-white/80">
                {pathname === "/jobs"
                  ? "Find work"
                  : pathname === "/freelancers"
                    ? "Talent marketplace"
                    : pathname === "/projects"
                      ? "Projects"
                      : pathname === "/applications"
                        ? "Applications"
                        : pathname === "/analytics"
                          ? "Analytics"
                          : pathname === "/messages"
                            ? "Messages"
                            : pathname === "/notifications"
                              ? "Notifications"
                              : pathname === "/profile"
                                ? "Profile"
                                : "Dashboard"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user?.role === "employer" && (
                <Link
                  href="/jobs/create"
                  className="hidden rounded-lg border border-white/[0.09] px-3 py-2 text-xs font-medium text-white/60 hover:bg-white/[0.05] sm:inline-flex"
                >
                  + Post
                </Link>
              )}

              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/50 hover:bg-white/[0.04]"
              >
                ♢
              </Link>

              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 text-xs font-bold"
              >
                {(user?.name || "A").slice(0, 1).toUpperCase()}
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 sm:p-8">{children}</div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#0c0c0e]/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
          {links.slice(0, 5).map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-w-14 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/35"
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/profile"
            className={`flex min-w-14 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] ${
              isActive(pathname, "/profile")
                ? "bg-white/[0.08] text-white"
                : "text-white/35"
            }`}
          >
            <span>●</span>
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
