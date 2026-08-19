"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type PortfolioItem = {
  _id: string;
  title: string;
  description: string;
  link?: string;
  skills: string[];
};

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills: string[];
  languages: string[];
  avatar?: string;
  rating: number;
  completedProjects: number;
  hourlyRate?: number;
  availability?: string;
};

type FormState = {
  name: string;
  headline: string;
  bio: string;
  location: string;
  skills: string;
  languages: string;
  hourlyRate: string;
  availability: string;
};

type PortfolioFormState = {
  title: string;
  description: string;
  link: string;
  skills: string;
};

const skillOptions = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Java",
  "C++",
  "Machine Learning",
  "Deep Learning",
  "PyTorch",
  "TensorFlow",
  "NLP",
  "LLMs",
  "Computer Vision",
  "FastAPI",
  "OWASP",
  "API Security",
  "Penetration Testing",
  "Burp Suite",
  "Network Security",
  "Linux",
  "Cloud Security",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "SQL",
  "Pandas",
  "NumPy",
  "ETL",
  "Data Visualization",
  "Figma",
  "UI/UX",
  "UX Research",
  "Prototyping",
  "React Native",
  "Flutter",
  "Technical Writing",
  "SEO",
  "Digital Marketing",
];

const availabilityOptions = [
  "Available",
  "Available this week",
  "Part-time",
  "Full-time",
  "Not currently available",
];

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  const [form, setForm] = useState<FormState>({
    name: "",
    headline: "",
    bio: "",
    location: "",
    skills: "",
    languages: "",
    hourlyRate: "",
    availability: "Available",
  });

  const [item, setItem] = useState<PortfolioFormState>({
    title: "",
    description: "",
    link: "",
    skills: "",
  });

  const [skillsOpen, setSkillsOpen] = useState(false);
  const [portfolioSkillsOpen, setPortfolioSkillsOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingPortfolio, setAddingPortfolio] = useState(false);

  async function load() {
    try {
      const data = await api<{
        user: Profile;
        portfolio: PortfolioItem[];
      }>("/profile/me");

      setProfile(data.user);
      setPortfolio(data.portfolio);

      setForm({
        name: data.user.name || "",
        headline: data.user.headline || "",
        bio: data.user.bio || "",
        location: data.user.location || "",
        skills: data.user.skills?.join(", ") || "",
        languages: data.user.languages?.join(", ") || "",
        hourlyRate:
          data.user.hourlyRate !== undefined
            ? String(data.user.hourlyRate)
            : "",
        availability: data.user.availability || "Available",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load profile."
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api("/profile/me", {
        method: "PATCH",
        json: {
          name: form.name.trim(),
          headline: form.headline.trim(),
          bio: form.bio.trim(),
          location: form.location.trim(),
          skills: form.skills
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          languages: form.languages
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          hourlyRate:
            form.hourlyRate.trim() !== ""
              ? Number(form.hourlyRate)
              : undefined,
          availability: form.availability,
        },
      });

      setMessage("Profile saved.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddingPortfolio(true);
    setMessage("");

    try {
      if (!item.title.trim() || !item.description.trim()) {
        setMessage("Portfolio title and description are required.");
        return;
      }

      await api("/portfolio", {
        method: "POST",
        json: {
          title: item.title.trim(),
          description: item.description.trim(),
          link: item.link.trim() || undefined,
          skills: item.skills
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        },
      });

      setItem({
        title: "",
        description: "",
        link: "",
        skills: "",
      });

      setMessage("Portfolio item added.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add portfolio item."
      );
    } finally {
      setAddingPortfolio(false);
    }
  }

  async function deletePortfolio(id: string) {
    try {
      await api(`/portfolio/${id}`, {
        method: "DELETE",
      });

      setMessage("Portfolio item deleted.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete portfolio item."
      );
    }
  }

  function addSkillToProfile(skill: string) {
    const current = form.skills
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const next = toggleValue(current, skill);

    setForm((currentForm) => ({
      ...currentForm,
      skills: next.join(", "),
    }));
  }

  function addSkillToPortfolio(skill: string) {
    const current = item.skills
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const next = toggleValue(current, skill);

    setItem((currentItem) => ({
      ...currentItem,
      skills: next.join(", "),
    }));
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0a0a0b] text-white">
        <div className="flex min-h-screen items-center justify-center text-sm text-white/30">
          Loading profile...
        </div>
      </main>
    );
  }

  const profileSkills = form.skills
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const portfolioSkills = item.skills
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm text-indigo-300">Profile</p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Build your professional presence.
        </h1>

        <p className="mt-2 text-sm text-white/35">
          Everything employers see about you starts here.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-3 text-sm text-emerald-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* PROFILE */}
        <form
          onSubmit={save}
          className="space-y-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
        >
          <h2 className="text-lg font-medium">Profile information</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              value={form.name}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  name: value,
                }))
              }
            />

            <Field
              label="Location"
              value={form.location}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  location: value,
                }))
              }
              placeholder="Hyderabad, India"
            />

            <Field
              label="Hourly rate (₹)"
              value={form.hourlyRate}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  hourlyRate: value,
                }))
              }
              type="number"
              required={false}
              placeholder="1000"
            />

            <SelectField
              label="Availability"
              value={form.availability}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  availability: value,
                }))
              }
              options={availabilityOptions}
            />
          </div>

          <Field
            label="Professional headline"
            value={form.headline}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                headline: value,
              }))
            }
            placeholder="Full-stack developer | React + Next.js"
          />

          <div>
            <label className="mb-2 block text-sm text-white/65">
              Bio
            </label>

            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  bio: e.target.value,
                }))
              }
              placeholder="Tell employers about your experience, strengths and the kind of work you enjoy."
              className="min-h-32 w-full rounded-xl border border-white/[0.10] bg-black/20 p-3 text-sm leading-6 outline-none focus:border-indigo-400/60"
            />
          </div>

          {/* PROFILE SKILLS */}
          <SkillDropdown
            label="Skills"
            selected={profileSkills}
            options={skillOptions}
            open={skillsOpen}
            setOpen={setSkillsOpen}
            onToggle={addSkillToProfile}
          />

          <Field
            label="Languages"
            value={form.languages}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                languages: value,
              }))
            }
            placeholder="English, Hindi, Telugu"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        {/* RIGHT SIDE */}
        <aside className="space-y-4">
          {/* PROFILE SUMMARY */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 text-lg font-bold">
                {profile.name.slice(0, 1).toUpperCase()}
              </div>

              <div>
                <p className="font-medium">{profile.name}</p>

                <p className="mt-1 text-xs text-white/35">
                  {profile.headline || "Freelancer"}
                </p>

                {profile.location && (
                  <p className="mt-1 text-xs text-white/25">
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Stat
                label="Rating"
                value={
                  profile.rating
                    ? `★ ${profile.rating}`
                    : "New"
                }
              />

              <Stat
                label="Projects"
                value={String(profile.completedProjects)}
              />

              <Stat
                label="Rate"
                value={
                  profile.hourlyRate
                    ? `₹${profile.hourlyRate}`
                    : "—"
                }
              />
            </div>
          </div>

          {/* PORTFOLIO */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">
              Portfolio
            </p>

            <h2 className="mt-1 text-lg font-medium">
              Selected work
            </h2>

            <form
              onSubmit={add}
              className="mt-5 space-y-3"
            >
              <Field
                label="Title"
                value={item.title}
                onChange={(value) =>
                  setItem((current) => ({
                    ...current,
                    title: value,
                  }))
                }
                placeholder="E-commerce platform"
              />

              <div>
                <label className="mb-2 block text-sm text-white/65">
                  Description
                </label>

                <textarea
                  required
                  value={item.description}
                  onChange={(e) =>
                    setItem((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  placeholder="What did you build?"
                  className="min-h-24 w-full rounded-xl border border-white/[0.08] bg-black/20 p-3 text-xs outline-none focus:border-indigo-400/60"
                />
              </div>

              {/* PORTFOLIO SKILLS */}
              <SkillDropdown
                label="Skills used"
                selected={portfolioSkills}
                options={skillOptions}
                open={portfolioSkillsOpen}
                setOpen={setPortfolioSkillsOpen}
                onToggle={addSkillToPortfolio}
              />

              <Field
                label="Link"
                value={item.link}
                onChange={(value) =>
                  setItem((current) => ({
                    ...current,
                    link: value,
                  }))
                }
                required={false}
                placeholder="https://..."
              />

              <button
                type="submit"
                disabled={addingPortfolio}
                className="w-full rounded-xl border border-white/[0.09] py-2.5 text-xs text-white/60 hover:bg-white hover:text-black disabled:opacity-50"
              >
                {addingPortfolio
                  ? "Adding..."
                  : "Add project"}
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {portfolio.length === 0 ? (
                <div className="rounded-xl border border-white/[0.07] p-4 text-xs text-white/30">
                  No portfolio projects yet.
                </div>
              ) : (
                portfolio.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-xl border border-white/[0.07] p-4"
                  >
                    <p className="font-medium">
                      {project.title}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/35">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-white/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-xs text-indigo-300"
                      >
                        View project ↗
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deletePortfolio(project._id)
                      }
                      className="mt-3 block text-xs text-red-300/60 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function SkillDropdown({
  label,
  selected,
  options,
  open,
  setOpen,
  onToggle,
}: {
  label: string;
  selected: string[];
  options: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onToggle: (skill: string) => void;
}) {
  return (
    <div className="relative">
      <label className="mb-2 block text-sm text-white/65">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-12 w-full items-center justify-between rounded-xl border border-white/[0.10] bg-black/20 px-4 py-3 text-left text-sm outline-none hover:border-indigo-400/60"
      >
        <span
          className={
            selected.length
              ? "text-white/80"
              : "text-white/30"
          }
        >
          {selected.length
            ? `${selected.length} selected`
            : "Select skills"}
        </span>

        <span className="text-white/35">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/[0.10] bg-[#111113] p-2 shadow-2xl">
          {options.map((skill) => {
            const active = selected.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => onToggle(skill)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/[0.05]"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                    active
                      ? "border-indigo-400 bg-indigo-400 text-black"
                      : "border-white/[0.20] text-transparent"
                  }`}
                >
                  ✓
                </span>

                <span
                  className={
                    active
                      ? "text-white"
                      : "text-white/55"
                  }
                >
                  {skill}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => onToggle(skill)}
              className="rounded-lg bg-indigo-400/[0.08] px-2.5 py-1 text-[11px] text-indigo-300 hover:bg-indigo-400/[0.14]"
            >
              {skill} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/65">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3 text-sm outline-none focus:border-indigo-400/60"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/65">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/[0.10] bg-[#111113] px-3 text-sm text-white/75 outline-none focus:border-indigo-400/60"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.035] p-3">
      <p className="text-xs text-white/30">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}