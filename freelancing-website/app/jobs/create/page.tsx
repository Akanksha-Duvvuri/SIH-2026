"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

const categories = [
  "Web Development", "AI / ML", "Cybersecurity", "Backend", "Data",
  "Mobile Development", "UI/UX", "DevOps / Cloud", "Content / Writing", "Marketing"
];

export default function CreateJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", company: "", description: "", category: "Web Development",
    skills: "", budgetMin: "", budgetMax: "", duration: "2 weeks",
    experienceLevel: "Intermediate", location: "India", workMode: "Remote"
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = await api<{ job: { _id: string } }>("/jobs", {
        method: "POST",
        json: {
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          budgetMin: Number(form.budgetMin),
          budgetMax: Number(form.budgetMax)
        }
      });
      router.push(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Employer workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Post a project.</h1>
        <p className="mt-2 text-sm text-white/35">
          Give freelancers enough context to understand what success looks like.
        </p>
      </div>

      <form onSubmit={submit} className="max-w-4xl space-y-5">
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h2 className="text-lg font-medium">Project basics</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Project title" value={form.title} onChange={(v) => update("title", v)} placeholder="Build a Next.js analytics dashboard" />
            <Field label="Company / client" value={form.company} onChange={(v) => update("company", v)} placeholder="Your company" />
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-white/65">Description</label>
              <textarea
                required value={form.description} onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the project, deliverables and constraints..."
                className="min-h-36 w-full rounded-xl border border-white/[0.10] bg-black/20 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-400/60"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h2 className="text-lg font-medium">Requirements</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField label="Category" value={form.category} onChange={(v) => update("category", v)} options={categories} />
            <Field label="Skills" value={form.skills} onChange={(v) => update("skills", v)} placeholder="Next.js, TypeScript, PostgreSQL" />
            <SelectField label="Experience" value={form.experienceLevel} onChange={(v) => update("experienceLevel", v)} options={["Beginner", "Intermediate", "Expert"]} />
            <SelectField label="Duration" value={form.duration} onChange={(v) => update("duration", v)} options={["3-5 days", "1 week", "2 weeks", "3 weeks", "1 month", "2+ months"]} />
            <SelectField label="Work mode" value={form.workMode} onChange={(v) => update("workMode", v)} options={["Remote", "Hybrid", "On-site"]} />
            <Field label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="India" />
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h2 className="text-lg font-medium">Budget</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Minimum budget" type="number" value={form.budgetMin} onChange={(v) => update("budgetMin", v)} placeholder="15000" />
            <Field label="Maximum budget" type="number" value={form.budgetMax} onChange={(v) => update("budgetMax", v)} placeholder="30000" />
          </div>
        </section>

        {error && <div className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300">{error}</div>}

        <div className="flex justify-end">
          <button disabled={saving} className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black disabled:opacity-50">
            {saving ? "Publishing..." : "Publish project"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/65">{label}</label>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/[0.10] bg-black/20 px-4 text-sm outline-none focus:border-indigo-400/60" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/65">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/[0.10] bg-[#111113] px-4 text-sm text-white/75 outline-none focus:border-indigo-400/60">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}
