"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Analytics = {
  totals: { openJobs: number; totalJobs: number; freelancers: number; projects: number; applications: number; avgProjectBudget: number };
  categories: { category: string; jobs: number; avgBudget: number }[];
  skills: { skill: string; demand: number }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  useEffect(() => { api<Analytics>("/analytics/marketplace").then(setData); }, []);
  if (!data) return <main className="min-h-screen bg-[#0a0a0b]" />;
  const maxSkill = Math.max(...data.skills.map((x) => x.demand), 1);
  return (
    <AppShell>
      <div className="mb-8"><p className="text-sm text-indigo-300">Marketplace intelligence</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">See what is moving.</h1><p className="mt-2 text-sm text-white/35">Live analytics from the marketplace database.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[["Open jobs", data.totals.openJobs], ["Freelancers", data.totals.freelancers], ["Projects", data.totals.projects], ["Applications", data.totals.applications], ["Avg. project", `₹${data.totals.avgProjectBudget.toLocaleString("en-IN")}`]].map(([a,b]) => <div key={String(a)} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><p className="text-xs text-white/30">{a}</p><p className="mt-3 text-xl font-semibold">{b}</p></div>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Skill demand</p><h2 className="mt-1 text-lg font-medium">Most requested skills</h2><div className="mt-6 space-y-4">{data.skills.map((x) => <div key={x.skill}><div className="mb-2 flex justify-between text-xs"><span className="text-white/55">{x.skill}</span><span className="text-white/30">{x.demand}</span></div><div className="h-2 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-indigo-400" style={{width: `${(x.demand / maxSkill) * 100}%`}} /></div></div>)}</div></section>
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Categories</p><h2 className="mt-1 text-lg font-medium">Project demand and typical budget</h2><div className="mt-6 grid gap-3">{data.categories.map((x) => <div key={x.category} className="flex items-center justify-between rounded-xl bg-white/[0.035] p-4"><div><p className="text-sm font-medium">{x.category}</p><p className="mt-1 text-xs text-white/30">{x.jobs} jobs</p></div><p className="text-sm">₹{x.avgBudget.toLocaleString("en-IN")}</p></div>)}</div></section>
      </div>
    </AppShell>
  );
}
