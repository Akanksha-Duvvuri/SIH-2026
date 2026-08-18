"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import EmployerDashboard from "@/components/EmployerDashboard";
import Link from "next/link";
import { api } from "@/lib/api";

type RecommendedJob = {
  _id: string;
  title: string;
  company: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  workMode: string;
  matchPercent: number;
};

type DashboardStats = {
  activeProjectsCount: number;
  applicationsCount: number;
  newResponsesCount: number;
  totalEarned: number;
  recommendedJobs: RecommendedJob[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api<{ user: { name: string; role: string } }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => router.replace("/"));
  }, [router]);

  useEffect(() => {
    if (user?.role === "freelancer") {
      api<DashboardStats>("/profile/dashboard")
        .then(setStats)
        .catch(() => {});
    }
  }, [user]);

  if (!user) return <main className="min-h-screen bg-[#0a0a0b]" />;

  if (user.role === "employer") {
    return <AppShell><EmployerDashboard /></AppShell>;
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Good morning</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {user.name}.</h1>
        <p className="mt-2 text-sm text-white/35">Your marketplace activity at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Active projects", stats ? String(stats.activeProjectsCount) : "—", stats && stats.activeProjectsCount > 0 ? `${stats.activeProjectsCount} in progress` : "No active projects"],
          ["Applications", stats ? String(stats.applicationsCount) : "—", stats ? `${stats.newResponsesCount} new responses` : ""],
          ["Total earned", stats ? `₹${stats.totalEarned.toLocaleString("en-IN")}` : "—", stats && stats.totalEarned > 0 ? "From approved milestones" : "Complete milestones to earn"]
        ].map(([a, b, c]) => (
          <div key={a} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-sm text-white/35">{a}</p><p className="mt-3 text-2xl font-semibold">{b}</p><p className="mt-1 text-xs text-emerald-300/70">{c}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Recommended</p><h2 className="mt-1 text-xl font-semibold">Opportunities for you</h2></div>
            <Link href="/jobs" className="text-xs text-white/35 hover:text-white">View all →</Link>
          </div>
          <div className="space-y-3">
            {!stats ? (
              <div className="rounded-2xl border border-white/[0.07] p-10 text-center text-sm text-white/30">Loading recommendations...</div>
            ) : stats.recommendedJobs.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] p-10 text-center">
                <p className="font-medium">No recommendations yet.</p>
                <p className="mt-2 text-sm text-white/30">Update your skills on your profile to get matched.</p>
              </div>
            ) : stats.recommendedJobs.map((job) => (
              <article key={job._id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{job.title}</h3>
                      {job.matchPercent > 0 && (
                        <span className="rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                          {job.matchPercent}% MATCH
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/35">{job.company} · {job.category}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">{skill}</span>)}</div>
                  </div>
                  <div className="flex items-end justify-between gap-5 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{job.budgetMin.toLocaleString("en-IN")} – ₹{job.budgetMax.toLocaleString("en-IN")}</p>
                      <p className="mt-1 text-xs text-white/30">{job.workMode} · {job.duration}</p>
                    </div>
                    <Link href={`/jobs/${job._id}`} className="rounded-lg border border-white/[0.10] px-3 py-2 text-xs font-medium text-white/70 hover:bg-white hover:text-black">View opportunity</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Profile focus</p>
            <h3 className="mt-3 text-lg font-medium">Strengthen your profile</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">Add portfolio projects and update your skills to make your profile more useful to employers.</p>
            <Link href="/profile" className="mt-5 block rounded-xl bg-white py-2.5 text-center text-xs font-semibold text-black">Edit profile</Link>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Applications</p>
            <p className="mt-2 text-2xl font-semibold">{stats ? stats.applicationsCount : "—"}</p>
            <Link href="/applications" className="mt-4 block text-xs text-indigo-300">Track applications →</Link>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
