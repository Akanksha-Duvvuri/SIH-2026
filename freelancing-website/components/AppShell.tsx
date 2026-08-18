"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "⌂" },
  { href: "/jobs", label: "Find work", icon: "⌕" },
  { href: "/freelancers", label: "Talent", icon: "◎" },
  { href: "/analytics", label: "Analytics", icon: "↗" },
  { href: "/applications", label: "Applications", icon: "▣" },
  { href: "/projects", label: "Projects", icon: "□" },
  { href: "/profile", label: "Profile", icon: "◎" },
  { href: "/notifications", label: "Notifications", icon: "♢" },
  { href: "/messages", label: "Messages", icon: "○" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    api<{ user: { name: string; role: string } }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/projects")) {
          router.replace("/");
        }
      });
  }, [pathname, router]);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0b] text-white">
      <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0c0c0e] lg:flex lg:flex-col h-full">
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/[0.07] px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
            FP
          </div>
          <span className="font-semibold">Freelance Platform</span>
        </div>

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                }`}
              >
                <span className="w-5 text-center">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <div className="mb-3 rounded-xl bg-white/[0.035] p-3">
            <p className="truncate text-sm font-medium">{user?.name || "Loading..."}</p>
            <p className="mt-1 text-xs capitalize text-white/30">{user?.role || "account"}</p>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/40 hover:bg-white/[0.04] hover:text-white"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0a0a0b]/80 backdrop-blur-md px-5 sm:px-8">
          <div>
            <p className="text-xs text-white/30">Workspace</p>
            <p className="mt-0.5 text-sm font-medium text-white/80">
              {pathname === "/jobs" ? "Find work" : pathname === "/freelancers" ? "Talent marketplace" : "Freelance platform"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.name || "Account"}</p>
              <p className="text-xs capitalize text-white/30">{user?.role || "..."}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 text-xs font-bold">
              {(user?.name || "A").slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-5 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
