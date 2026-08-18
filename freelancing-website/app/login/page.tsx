"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api("/auth/login", {
        method: "POST",
        json: { email, password }
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b] px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full">
          <Link href="/" className="text-sm text-white/35 hover:text-white">
            ← Back
          </Link>

          <div className="mb-8 mt-10">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-bold text-black">
              FP
            </div>
            <p className="text-sm text-indigo-300">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-2 text-sm text-white/35">
              Access your freelance workspace.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 text-sm outline-none focus:border-indigo-400/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 text-sm outline-none focus:border-indigo-400/60"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-white/35">
            New here?{" "}
            <Link href="/register" className="text-indigo-300 hover:text-indigo-200">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-xs text-white/35">
            Demo accounts are available after the database seed:
            <br />
            <span className="text-white/55">freelancer@demo.local</span> / DemoPass123!
            <br />
            <span className="text-white/55">employer@demo.local</span> / DemoPass123!
          </div>
        </div>
      </div>
    </main>
  );
}
