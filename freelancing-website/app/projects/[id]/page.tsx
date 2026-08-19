 "use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/api";

type Project = {
  _id: string;
  totalAmount: number;
  status: string;
  escrowStatus: string;
  jobId: {
    title: string;
    company: string;
    category: string;
    description: string;
    skills: string[];
  };
  freelancerId: { _id: string; name: string; headline?: string; rating: number };
  employerId: { _id: string; name: string };
};

type Review = {
  _id: string;
  rating: number;
  comment: string;
  reviewerId: { name: string };
};

type Transaction = {
  _id: string;
  type: string;
  amount: number;
  reference: string;
  createdAt: string;
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [review, setReview] = useState({ rating: "5", comment: "" });
  const [message, setMessage] = useState("");

  async function load() {
    const [projectData, reviewData, transactionData] = await Promise.all([
      api<{ project: Project }>(`/projects/${id}`),
      api<{ reviews: Review[] }>(`/reviews/project/${id}`),
      api<{ transactions: Transaction[] }>(`/transactions/project/${id}`),
    ]);

    setProject(projectData.project);
    setReviews(reviewData.reviews);
    setTransactions(transactionData.transactions);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function fund() {
    await api(`/transactions/project/${id}/fund`, { method: "POST" });
    setMessage("Project funded and started.");
    load();
  }

  async function release() {
    await api(`/transactions/project/${id}/release`, { method: "POST" });
    setMessage("Remaining escrow released and project completed.");
    load();
  }

  async function addReview(e: FormEvent) {
    e.preventDefault();

    try {
      await api(`/reviews/project/${id}`, {
        method: "POST",
        json: {
          rating: Number(review.rating),
          comment: review.comment,
        },
      });

      setReview({ rating: "5", comment: "" });
      setMessage("Review submitted.");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to submit review.");
    }
  }

  if (!project) {
    return <main className="min-h-screen bg-[#0a0a0b]" />;
  }

  const funded = transactions
    .filter((t) => t.type === "escrow-fund")
    .reduce((sum, t) => sum + t.amount, 0);

  const released = transactions
    .filter((t) => t.type === "milestone-release")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppShell>
      <Link href="/projects" className="text-sm text-white/35 hover:text-white">
        ← Back to projects
      </Link>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_330px]">
        <section className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-400/[0.08] px-2.5 py-1 text-xs text-indigo-300">
                {project.jobId.category}
              </span>
              <span className="rounded-full bg-emerald-400/[0.08] px-2.5 py-1 text-xs capitalize text-emerald-300">
                {project.status.replace("-", " ")}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {project.jobId.title}
            </h1>
            <p className="mt-2 text-sm text-white/35">
              {project.jobId.company}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.035] p-4">
                <p className="text-xs text-white/30">Freelancer</p>
                <p className="mt-2 text-sm font-medium">
                  {project.freelancerId.name}
                </p>
                <p className="mt-1 text-xs text-white/30">
                  {project.freelancerId.headline || "Freelancer"}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.035] p-4">
                <p className="text-xs text-white/30">Employer</p>
                <p className="mt-2 text-sm font-medium">
                  {project.employerId.name}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium">Project scope</h2>
              <p className="mt-3 text-sm leading-7 text-white/45">
                {project.jobId.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.jobId.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">
                  Payment history
                </p>
                <h2 className="mt-1 text-xl font-medium">
                  Escrow ledger
                </h2>
              </div>

              <div className="text-right text-xs text-white/30">
                <p>Funded ₹{funded.toLocaleString("en-IN")}</p>
                <p>Released ₹{released.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {transactions.length === 0 ? (
              <p className="mt-5 text-sm text-white/30">
                No transactions yet.
              </p>
            ) : (
              <div className="mt-5 space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between rounded-xl bg-white/[0.035] p-4"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {transaction.type.replace("-", " ")}
                      </p>
                      <p className="mt-1 text-[11px] text-white/25">
                        {transaction.reference}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ₹{transaction.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">
              Reviews
            </p>
            <h2 className="mt-1 text-lg font-medium">Project reputation</h2>

            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-white/30">
                Reviews become available once the project is completed.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {reviews.map((item) => (
                  <div key={item._id} className="rounded-xl bg-white/[0.035] p-4">
                    <p className="text-sm">
                      ★ {item.rating} · {item.reviewerId.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/40">
                      {item.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {project.status === "completed" && (
              <form onSubmit={addReview} className="mt-5 space-y-3">
                <select
                  value={review.rating}
                  onChange={(e) =>
                    setReview({ ...review, rating: e.target.value })
                  }
                  className="h-10 rounded-lg border border-white/[0.08] bg-[#111113] px-3 text-xs"
                >
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Good</option>
                  <option value="3">3 — Average</option>
                  <option value="2">2 — Poor</option>
                  <option value="1">1 — Very poor</option>
                </select>

                <textarea
                  required
                  value={review.comment}
                  onChange={(e) =>
                    setReview({ ...review, comment: e.target.value })
                  }
                  placeholder="Leave a review..."
                  className="min-h-24 w-full rounded-lg border border-white/[0.08] bg-black/20 p-3 text-xs"
                />

                <button className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-white/60 hover:bg-white/[0.05]">
                  Submit review
                </button>
              </form>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-indigo-300">
              Contract
            </p>

            <p className="mt-3 text-3xl font-semibold">
              ₹{project.totalAmount.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-white/30">
              Total project value
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-xs text-white/30">Escrow status</p>
              <p className="mt-1 text-sm font-medium capitalize text-emerald-300">
                {project.escrowStatus.replace("-", " ")}
              </p>
            </div>

            {project.escrowStatus === "not-funded" && (
              <button
                onClick={fund}
                className="mt-4 w-full rounded-xl bg-white py-3 text-xs font-semibold text-black"
              >
                Fund project
              </button>
            )}

            {project.status !== "completed" &&
              project.escrowStatus === "funded" && (
                <button
                  onClick={release}
                  className="mt-3 w-full rounded-xl border border-white/[0.09] py-3 text-xs text-white/60 hover:bg-white/[0.05]"
                >
                  Release remaining payment & complete
                </button>
              )}

            {message && (
              <p className="mt-3 text-xs text-emerald-300">{message}</p>
            )}
          </div>

          <Link
            href="/messages"
            className="block rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 hover:bg-white/[0.04]"
          >
            <p className="text-xs text-white/30">Project communication</p>
            <h3 className="mt-2 font-medium">Open messages →</h3>
            <p className="mt-2 text-sm text-white/35">
              Talk directly with the other side of the project.
            </p>
          </Link>
        </aside>
      </div>
    </AppShell>
  );
}
