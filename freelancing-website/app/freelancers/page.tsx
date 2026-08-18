"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";

const people = [
  { name: "Aarav Mehta", role: "Full-stack Developer", location: "Bengaluru", rate: 1200, rating: 4.9, projects: 31, skills: ["Next.js", "Node.js", "MongoDB", "AWS"] },
  { name: "Priya Nair", role: "AI / ML Engineer", location: "Hyderabad", rate: 1600, rating: 4.8, projects: 24, skills: ["Python", "PyTorch", "NLP", "FastAPI"] },
  { name: "Kabir Singh", role: "Cybersecurity Specialist", location: "Pune", rate: 1800, rating: 5.0, projects: 19, skills: ["OWASP", "Pentesting", "Linux", "API Security"] },
  { name: "Ananya Rao", role: "Frontend Engineer", location: "Chennai", rate: 950, rating: 4.7, projects: 42, skills: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { name: "Rohan Shah", role: "Data Engineer", location: "Mumbai", rate: 1400, rating: 4.9, projects: 27, skills: ["Python", "SQL", "ETL", "MongoDB"] },
  { name: "Meera Iyer", role: "UI/UX Designer", location: "Delhi", rate: 900, rating: 4.8, projects: 36, skills: ["Figma", "UX Research", "Prototyping", "Design Systems"] }
];

export default function FreelancersPage() {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All");
  const skills = ["All", "Next.js", "Python", "Cybersecurity", "React", "MongoDB", "Figma"];

  const filtered = useMemo(() => people.filter((p) => {
    const q = search.toLowerCase();
    const textMatch = !q || `${p.name} ${p.role} ${p.location} ${p.skills.join(" ")}`.toLowerCase().includes(q);
    const skillMatch = skill === "All" || p.skills.includes(skill) || (skill === "Cybersecurity" && p.role.includes("Cybersecurity"));
    return textMatch && skillMatch;
  }), [search, skill]);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Talent marketplace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Find people who can ship.</h1>
        <p className="mt-2 text-sm text-white/35">Search verified-looking demo profiles across technical and creative disciplines.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search freelancers, skills or locations..." className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm outline-none focus:border-indigo-400/50" />
        <div className="mt-4 flex gap-2 overflow-x-auto">{skills.map((s) => <button key={s} onClick={() => setSkill(s)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs ${skill === s ? "bg-white text-black" : "bg-white/[0.04] text-white/40"}`}>{s}</button>)}</div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((person) => (
          <article key={person.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/80 to-sky-400/80 text-sm font-bold">{person.name.split(" ").map((n) => n[0]).join("")}</div>
              <span className="rounded-full bg-emerald-400/[0.08] px-2 py-1 text-[10px] text-emerald-300">AVAILABLE</span>
            </div>
            <h2 className="mt-4 font-medium">{person.name}</h2>
            <p className="mt-1 text-xs text-white/35">{person.role} · {person.location}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/45"><span>★ {person.rating}</span><span>{person.projects} projects</span><span>₹{person.rate}/hr</span></div>
            <div className="mt-4 flex flex-wrap gap-2">{person.skills.map((s) => <span key={s} className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">{s}</span>)}</div>
            <button className="mt-5 w-full rounded-xl border border-white/[0.09] py-2.5 text-xs font-medium text-white/60 hover:bg-white hover:text-black">View profile</button>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
