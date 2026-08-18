"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"freelancer" | "employer">("freelancer");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api("/auth/register", {
        method: "POST",
        json: { ...form, role }
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b] px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full">
          <Link href="/" className="text-sm text-white/35 hover:text-white">← Back</Link>

          <div className="mb-8 mt-10">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-bold text-black">FP</div>
            <p className="text-sm text-indigo-300">Get started</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-white/35">Join as a freelancer or employer.</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.035] p-1">
            {(["freelancer", "employer"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-lg py-2.5 text-sm capitalize ${
                  role === item ? "bg-white text-black" : "text-white/40"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {[
              ["name", "Full name", "Your name", "text"],
              ["email", "Email", "you@example.com", "email"],
              ["password", "Password", "At least 8 characters", "password"]
            ].map(([key, label, placeholder, type]) => (
              <div key={key}>
                <label className="mb-2 block text-sm text-white/70">{label}</label>
                <input
                  required
                  minLength={key === "password" ? 8 : undefined}
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 text-sm outline-none focus:border-indigo-400/60"
                />
              </div>
            ))}

            {error && <div className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">{error}</div>}

            <button disabled={loading} className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-black disabled:opacity-50">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-white/35">
            Already have an account? <Link href="/login" className="text-indigo-300">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
