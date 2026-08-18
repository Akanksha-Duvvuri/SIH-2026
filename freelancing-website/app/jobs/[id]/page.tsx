"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Job = {
  _id: string; title: string; company: string; category: string; description: string;
  skills: string[]; budgetMin: number; budgetMax: number; duration: string;
  experienceLevel: string; workMode: string; location: string; applications: number;
};
type User = { id: string; role: "freelancer" | "employer"; name: string };

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ job: Job }>(`/jobs/${id}`),
      api<{ user: User }>("/auth/me").catch(() => null)
    ]).then(([jobData, meData]) => {
      setJob(jobData.job);
      if (meData) setUser(meData.user);
    });
  }, [id]);

  async function apply(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await api(`/applications/job/${id}`, {
        method: "POST",
        json: { proposal, bidAmount: Number(bidAmount) }
      });
      setShowApply(false);
      setProposal("");
      setBidAmount("");
      setMessage("Application submitted successfully.");
      setJob((current) => current ? { ...current, applications: current.applications + 1 } : current);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to apply.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!job) return <main className="min-h-screen bg-[#0a0a0b]" />;

  return (
    <AppShell>
      <Link href="/jobs" className="text-sm text-white/35 hover:text-white">← Back to opportunities</Link>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_330px]">
        <section>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <span className="rounded-full bg-indigo-400/[0.08] px-2.5 py-1 text-xs text-indigo-300">{job.category}</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{job.title}</h1>
            <p className="mt-2 text-sm text-white/35">{job.company} · {job.location} · {job.workMode}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["Budget", `₹${job.budgetMin.toLocaleString("en-IN")} – ₹${job.budgetMax.toLocaleString("en-IN")}`], ["Duration", job.duration], ["Experience", job.experienceLevel], ["Applications", String(job.applications)]].map(([a,b]) => (
                <div key={a} className="rounded-xl bg-white/[0.035] p-4"><p className="text-xs text-white/30">{a}</p><p className="mt-2 text-sm font-medium">{b}</p></div>
              ))}
            </div>
            <div className="mt-8"><h2 className="text-lg font-medium">About the project</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-white/45">{job.description}</p></div>
            <div className="mt-8"><h2 className="text-lg font-medium">Required skills</h2><div className="mt-3 flex flex-wrap gap-2">{job.skills.map((s) => <span key={s} className="rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-white/60">{s}</span>)}</div></div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Apply</p>
            {user?.role === "freelancer" ? (
              !showApply ? (
                <button onClick={() => setShowApply(true)} className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-black">Apply to project</button>
              ) : (
                <form onSubmit={apply} className="mt-5 space-y-3">
                  <textarea required value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Tell the employer why you're a good fit..." className="min-h-32 w-full rounded-xl border border-white/[0.10] bg-black/20 p-3 text-sm outline-none focus:border-indigo-400/60" />
                  <input required type="number" min={1} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Your bid in ₹" className="h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3 text-sm outline-none focus:border-indigo-400/60" />
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setShowApply(false)} className="rounded-xl border border-white/[0.08] py-2.5 text-xs text-white/50">Cancel</button>
                    <button disabled={submitting} className="rounded-xl bg-white py-2.5 text-xs font-semibold text-black">{submitting ? "Sending..." : "Submit application"}</button>
                  </div>
                </form>
              )
            ) : user?.role === "employer" ? (
              <Link href={`/jobs/${job._id}/edit`} className="mt-5 block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-black">Manage project</Link>
            ) : (
              <Link href="/login" className="mt-5 block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-black">Sign in to apply</Link>
            )}
            {message && <p className="mt-3 text-xs text-emerald-300">{message}</p>}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-xs text-white/30">Payment protection</p>
            <h3 className="mt-2 font-medium">Milestone-based delivery</h3>
            <p className="mt-2 text-sm leading-6 text-white/35">The project can be split into deliverables with payment attached to approved milestones.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
