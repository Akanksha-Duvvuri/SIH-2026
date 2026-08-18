"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Job = {
  _id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  experienceLevel: string;
  workMode: string;
  location: string;
  applications: number;
};

const categories = ["All", "Web Development", "AI / ML", "Cybersecurity", "Backend", "Data", "Design"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [experience, setExperience] = useState("All");
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    if (workMode !== "All") params.set("workMode", workMode);
    if (experience !== "All") params.set("experienceLevel", experience);

    try {
      const data = await api<{ jobs: Job[] }>(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadJobs, 250);
    return () => clearTimeout(timer);
  }, [search, category, workMode, experience]);

  const resultLabel = useMemo(() => `${jobs.length} opportunities`, [jobs.length]);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Marketplace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Find work that fits you.</h1>
        <p className="mt-2 text-sm text-white/35">Search across web development, AI, cybersecurity, data and more.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs, skills, technologies..." className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/20 pl-11 pr-4 text-sm outline-none focus:border-indigo-400/50" />
          </div>
          <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="h-12 rounded-xl border border-white/[0.08] bg-[#111113] px-4 text-sm text-white/70 outline-none">
            <option>All</option><option>Remote</option><option>Hybrid</option><option>On-site</option>
          </select>
          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="h-12 rounded-xl border border-white/[0.08] bg-[#111113] px-4 text-sm text-white/70 outline-none">
            <option>All</option><option>Beginner</option><option>Intermediate</option><option>Expert</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs ${category === item ? "bg-white text-black" : "bg-white/[0.04] text-white/40 hover:text-white"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-7 flex items-center justify-between">
        <p className="text-sm text-white/40">{resultLabel}</p>
        <button onClick={loadJobs} className="text-xs text-white/30 hover:text-white">Refresh</button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/[0.07] p-10 text-center text-sm text-white/30">Loading opportunities...</div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] p-10 text-center">
          <p className="font-medium">No matching opportunities</p>
          <p className="mt-2 text-sm text-white/30">Try another skill, category or filter.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job, index) => (
            <Link key={job._id} href={`/jobs/${job._id}`} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.14] hover:bg-white/[0.04]">
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium group-hover:text-white">{job.title}</h2>
                    {index < 3 && <span className="rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-2 py-0.5 text-[10px] font-semibold text-indigo-300">{94 - index * 4}% MATCH</span>}
                  </div>
                  <p className="mt-1 text-xs text-white/30">{job.company} · {job.category}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-white/45">{job.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => <span key={skill} className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">{skill}</span>)}
                  </div>
                </div>
                <div className="shrink-0 lg:w-44">
                  <p className="text-lg font-semibold">₹{job.budgetMin.toLocaleString("en-IN")} – ₹{job.budgetMax.toLocaleString("en-IN")}</p>
                  <p className="mt-1 text-xs text-white/30">{job.duration} · {job.workMode}</p>
                  <p className="mt-3 text-xs text-white/30">{job.applications} applications</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
