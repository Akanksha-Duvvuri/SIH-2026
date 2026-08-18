"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Application = {
  _id: string;
  proposal: string;
  bidAmount: number;
  status: string;
  jobId: {
    _id: string; title: string; company: string; category: string;
    budgetMin: number; budgetMax: number; duration: string; workMode: string; status: string;
  };
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await api<{ applications: Application[] }>("/applications/me");
      setApplications(data.applications);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function withdraw(id: string) {
    await api(`/applications/${id}/withdraw`, { method: "PATCH" });
    load();
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Freelancer workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your applications.</h1>
        <p className="mt-2 text-sm text-white/35">Track every proposal from submission to hiring.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/[0.07] p-10 text-center text-sm text-white/30">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] p-10 text-center">
          <p className="font-medium">No applications yet.</p>
          <Link href="/jobs" className="mt-3 inline-block text-sm text-indigo-300">Browse opportunities →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <article key={application._id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <Link href={`/jobs/${application.jobId._id}`} className="font-medium hover:text-indigo-300">{application.jobId.title}</Link>
                  <p className="mt-1 text-xs text-white/30">{application.jobId.company} · {application.jobId.category}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">{application.proposal}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm font-semibold">₹{application.bidAmount.toLocaleString("en-IN")}</p>
                  <span className="mt-2 inline-flex rounded-full bg-indigo-400/[0.08] px-2.5 py-1 text-[10px] font-medium capitalize text-indigo-300">{application.status}</span>
                </div>
              </div>

              {["submitted", "shortlisted"].includes(application.status) && (
                <button onClick={() => withdraw(application._id)} className="mt-5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/40 hover:bg-white/[0.04] hover:text-white">
                  Withdraw application
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
