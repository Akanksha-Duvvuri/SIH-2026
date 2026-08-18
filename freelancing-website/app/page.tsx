import Link from "next/link";

const categories = [
  ["Web Development", "React, Next.js, Node.js"],
  ["AI / ML", "Python, LLMs, computer vision"],
  ["Cybersecurity", "AppSec, audits, infrastructure"],
  ["Data", "Analytics, ETL, SQL"],
  ["Design", "UI/UX, product, branding"]
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">FP</div><span className="font-semibold">Freelance Platform</span></div>
        <div className="flex items-center gap-3"><Link href="/login" className="rounded-lg px-4 py-2 text-sm text-white/55 hover:text-white">Sign in</Link><Link href="/register" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">Get started</Link></div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:pt-28">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">The intelligent freelance marketplace</p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">Find work that fits.<br />Hire talent that delivers.</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">Connect freelancers and employers through AI-assisted matching, project milestones, reputation and marketplace intelligence.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/jobs" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Explore opportunities</Link><Link href="/register" className="rounded-xl border border-white/[0.10] px-5 py-3 text-sm font-medium text-white/70 hover:bg-white/[0.05]">Create account</Link></div>
        </div>

        <div className="mt-20 grid gap-3 md:grid-cols-3">
          {[["01", "AI matching", "See why an opportunity or candidate is a strong fit instead of relying on a generic search result."], ["02", "Milestone protection", "Break projects into deliverables and connect payments to approved milestones."], ["03", "Market intelligence", "Understand demand, pricing and skill gaps across the marketplace."]].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><span className="text-xs text-indigo-300">{n}</span><h2 className="mt-5 font-medium">{t}</h2><p className="mt-2 text-sm leading-6 text-white/35">{d}</p></div>)}
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-white/25">Explore the marketplace</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {categories.map(([a,b]) => <Link key={a} href="/jobs" className="rounded-2xl border border-white/[0.07] p-5 hover:bg-white/[0.04]"><h3 className="font-medium">{a}</h3><p className="mt-2 text-xs leading-5 text-white/30">{b}</p></Link>)}
          </div>
        </div>
      </section>
    </main>
  );
}
