"use client";

import AppShell from "@/components/AppShell";

const skills = [["Python", 88], ["React", 82], ["Next.js", 76], ["Node.js", 71], ["AWS", 54], ["Cybersecurity", 49]];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Marketplace intelligence</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">See where the market is moving.</h1>
        <p className="mt-2 text-sm text-white/35">Turn marketplace activity into decisions for freelancers and employers.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Active projects", "284"], ["Open opportunities", "1,240"], ["Freelancers", "8,421"], ["Avg. project", "₹27.4k"]].map(([a, b]) => <div key={a} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><p className="text-xs text-white/30">{a}</p><p className="mt-3 text-2xl font-semibold">{b}</p></div>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Demand</p><h2 className="mt-1 text-lg font-medium">Skills employers want</h2></div><span className="text-xs text-white/25">Current period</span></div>
          <div className="mt-7 space-y-4">
            {skills.map(([name, value]) => <div key={String(name)}><div className="mb-2 flex justify-between text-xs"><span className="text-white/55">{name}</span><span className="text-white/30">{value}%</span></div><div className="h-2 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-indigo-400" style={{ width: `${value}%` }} /></div></div>)}
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">AI market insight</p>
          <h2 className="mt-3 text-xl font-medium">AI/ML demand is rising faster than supply.</h2>
          <p className="mt-3 text-sm leading-7 text-white/45">The current marketplace shows strong demand for Python, machine learning and deployment skills. Candidates combining ML with cloud or API deployment are comparatively harder to find.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4"><p className="text-xs text-white/30">AI/ML demand</p><p className="mt-2 text-xl font-semibold text-emerald-300">+27%</p></div>
            <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4"><p className="text-xs text-white/30">Skill gap</p><p className="mt-2 text-xl font-semibold">+18%</p></div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Category intelligence</p>
        <h2 className="mt-1 text-lg font-medium">Typical project budgets</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[["Web Development", "₹24.5k"], ["AI / ML", "₹38.2k"], ["Cybersecurity", "₹42.8k"], ["Design", "₹15.1k"]].map(([a,b]) => <div key={a} className="rounded-xl bg-white/[0.035] p-4"><p className="text-xs text-white/35">{a}</p><p className="mt-2 text-lg font-medium">{b}</p><p className="mt-1 text-[11px] text-white/25">average project value</p></div>)}
        </div>
      </section>
    </AppShell>
  );
}
