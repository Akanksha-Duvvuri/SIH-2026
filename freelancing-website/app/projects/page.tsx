"use client";

import AppShell from "@/components/AppShell";

export default function ProjectsPage() {
  const milestones = [
    ["UI & Architecture", "₹12,000", "Completed", "100%"],
    ["Backend & APIs", "₹18,000", "In progress", "67%"],
    ["Deployment", "₹15,000", "Pending", "0%"]
  ];

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Project management</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your projects.</h1>
        <p className="mt-2 text-sm text-white/35">Track delivery, milestones and protected payments.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex items-center gap-2"><h2 className="text-xl font-medium">E-commerce Platform</h2><span className="rounded-full bg-emerald-400/[0.08] px-2 py-1 text-[10px] text-emerald-300">IN PROGRESS</span></div>
              <p className="mt-1 text-xs text-white/30">Northstar Labs · Full-stack development</p>
            </div>
            <p className="text-xl font-semibold">₹45,000</p>
          </div>

          <div className="mt-8 space-y-3">
            {milestones.map(([title, amount, status, progress], index) => (
              <div key={title} className="rounded-xl border border-white/[0.07] bg-black/15 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-white/30">{amount} · Milestone {index + 1}</p></div>
                  <span className={`text-xs ${status === "Completed" ? "text-emerald-300" : status === "In progress" ? "text-indigo-300" : "text-white/25"}`}>{status}</span>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-indigo-400" style={{ width: progress }} /></div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">Escrow</p>
          <p className="mt-3 text-3xl font-semibold">₹45,000</p>
          <p className="mt-1 text-xs text-white/30">Total project value</p>
          <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/20 p-4">
            <p className="text-xs text-white/30">Status</p>
            <p className="mt-1 text-sm font-medium text-emerald-300">● Funds protected</p>
            <p className="mt-3 text-xs leading-5 text-white/35">Payment is associated with project milestones and released when work is approved.</p>
          </div>
          <button className="mt-4 w-full rounded-xl bg-white py-3 text-xs font-semibold text-black">Open project workspace</button>
        </aside>
      </div>
    </AppShell>
  );
}
