"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Job = {
  _id: string; title: string; company: string; category: string; description: string;
  skills: string[]; budgetMin: number; budgetMax: number; duration: string;
  experienceLevel: string; workMode: string; location: string; applications: number;
};

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    api<{ job: Job }>(`/jobs/${id}`).then((data) => setJob(data.job));
  }, [id]);

  if (!job) return <main className="min-h-screen bg-[#0a0a0b]" />;

  return (
    <AppShell>
      <Link href="/jobs" className="text-sm text-white/35 hover:text-white">← Back to opportunities</Link>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_330px]">
        <section>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-400/[0.08] px-2.5 py-1 text-xs text-indigo-300">94% AI MATCH</span>
              <span className="text-xs text-white/25">{job.category}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{job.title}</h1>
            <p className="mt-2 text-sm text-white/35">{job.company} · {job.location} · {job.workMode}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Budget", `₹${job.budgetMin.toLocaleString("en-IN")} – ₹${job.budgetMax.toLocaleString("en-IN")}`],
                ["Duration", job.duration],
                ["Experience", job.experienceLevel],
                ["Applications", String(job.applications)]
              ].map(([a, b]) => <div key={a} className="rounded-xl bg-white/[0.035] p-4"><p className="text-xs text-white/30">{a}</p><p className="mt-2 text-sm font-medium">{b}</p></div>)}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium">About the project</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/45">{job.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium">Required skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">{job.skills.map((s) => <span key={s} className="rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-white/60">{s}</span>)}</div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Why you match</p>
            <p className="mt-3 text-sm leading-6 text-white/50">Your React, Next.js and TypeScript experience overlaps strongly with this project.</p>
            <div className="mt-5 space-y-3 text-xs text-white/55">
              <p>✓ 5/5 core skills matched</p><p>✓ Budget within your range</p><p>✓ Timeline fits availability</p><p>✓ Similar portfolio work</p>
            </div>
            <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-white/90">Apply to project</button>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Project protection</p>
            <h3 className="mt-2 font-medium">Milestone-based payment</h3>
            <p className="mt-2 text-sm leading-6 text-white/35">Payments can be released against approved deliverables instead of a single upfront transfer.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
