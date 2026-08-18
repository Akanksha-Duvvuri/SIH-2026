"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type EmployerApplication = {
  _id: string;
  status: string;
  bidAmount: number;
  jobId: { _id: string; title: string; company: string; budgetMin: number; budgetMax: number };
  freelancerId: {
    _id: string; name: string; headline?: string; location?: string;
    skills: string[]; rating: number; completedProjects: number;
  };
};

type DashboardData = {
  jobs: {
    _id: string; title: string; company: string; category: string;
    budgetMin: number; budgetMax: number; duration: string; status: string; applications: number;
  }[];
  applications: EmployerApplication[];
  stats: { totalJobs: number; openJobs: number; activeProjects: number; totalApplications: number; shortlisted: number };
};

export default function EmployerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try { setData(await api<DashboardData>("/employer/dashboard")); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load dashboard."); }
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: "shortlisted" | "accepted" | "rejected") {
    await api(`/applications/${id}/status`, { method: "PATCH", json: { status } });
    load();
  }

  if (error) return <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-6 text-sm text-red-300">{error}</div>;
  if (!data) return <div className="text-sm text-white/30">Loading employer workspace...</div>;

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-indigo-300">Employer workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Hire with context.</h1>
          <p className="mt-2 text-sm text-white/35">Manage your projects and evaluate applicants in one place.</p>
        </div>
        <Link href="/jobs/create" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">+ Post a project</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Posted jobs", data.stats.totalJobs], ["Open jobs", data.stats.openJobs], ["Applications", data.stats.totalApplications], ["Shortlisted", data.stats.shortlisted]].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-sm text-white/35">{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section>
          <div className="mb-4"><p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Your jobs</p><h2 className="mt-1 text-xl font-semibold">Projects you've posted</h2></div>
          <div className="space-y-3">
            {data.jobs.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] p-8 text-sm text-white/30">You haven't posted a project yet.</div>
            ) : data.jobs.map((job) => (
              <div key={job._id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="flex justify-between gap-4">
                  <div><Link href={`/jobs/${job._id}`} className="font-medium hover:text-indigo-300">{job.title}</Link><p className="mt-1 text-xs text-white/30">{job.category} · {job.duration}</p></div>
                  <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] capitalize text-white/45">{job.status}</span>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs"><span className="text-white/30">Budget</span><span>₹{job.budgetMin.toLocaleString("en-IN")} – ₹{job.budgetMax.toLocaleString("en-IN")}</span></div>
                <div className="mt-2 flex items-center justify-between text-xs"><span className="text-white/30">Applications</span><span className="text-indigo-300">{job.applications}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4"><p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Applicants</p><h2 className="mt-1 text-xl font-semibold">Latest applications</h2></div>
          <div className="space-y-3">
            {data.applications.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] p-8 text-sm text-white/30">Applications will appear here.</div>
            ) : data.applications.slice(0, 8).map((application) => (
              <div key={application._id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="font-medium">{application.freelancerId.name}</h3><p className="mt-1 text-xs text-white/30">{application.freelancerId.headline || "Freelancer"} · {application.freelancerId.location || "India"}</p><p className="mt-2 text-xs text-indigo-300">{application.jobId.title}</p></div>
                  <span className="text-sm font-semibold">₹{application.bidAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {application.freelancerId.skills.slice(0, 5).map((skill) => <span key={skill} className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">{skill}</span>)}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-white/35">★ {application.freelancerId.rating || "New"} · {application.freelancerId.completedProjects} projects</p>
                  <span className="text-[10px] capitalize text-white/30">{application.status}</span>
                </div>

                {application.status === "submitted" && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button onClick={() => setStatus(application._id, "shortlisted")} className="rounded-lg border border-white/[0.08] py-2 text-[11px] text-white/55 hover:bg-white/[0.05]">Shortlist</button>
                    <button onClick={() => setStatus(application._id, "accepted")} className="rounded-lg bg-white py-2 text-[11px] font-semibold text-black">Accept</button>
                    <button onClick={() => setStatus(application._id, "rejected")} className="rounded-lg border border-red-400/10 py-2 text-[11px] text-red-300/70 hover:bg-red-400/[0.05]">Reject</button>
                  </div>
                )}

                {application.status === "shortlisted" && (
                  <button onClick={() => setStatus(application._id, "accepted")} className="mt-4 w-full rounded-lg bg-white py-2 text-xs font-semibold text-black">Accept freelancer</button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
