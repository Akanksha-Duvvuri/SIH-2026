import type { Response } from "express";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Application } from "../models/Application.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function getAnalytics(_req: AuthRequest, res: Response) {
  const [jobs, freelancers, projects, applications, categoryAgg, skillAgg] = await Promise.all([
    Job.find().select("category budgetMin budgetMax status createdAt skills").lean(),
    User.countDocuments({ role: "freelancer" }),
    Project.countDocuments(),
    Application.countDocuments(),
    Job.aggregate([
      { $group: { _id: "$category", jobs: { $sum: 1 }, avgBudget: { $avg: { $avg: ["$budgetMin", "$budgetMax"] } } } },
      { $sort: { jobs: -1 } },
      { $limit: 10 }
    ]),
    Job.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", demand: { $sum: 1 } } },
      { $sort: { demand: -1 } },
      { $limit: 12 }
    ])
  ]);

  const avgProjectBudget = jobs.length
    ? jobs.reduce((sum, j) => sum + (j.budgetMin + j.budgetMax) / 2, 0) / jobs.length
    : 0;

  return res.json({
    totals: {
      openJobs: jobs.filter((job) => job.status === "open").length,
      totalJobs: jobs.length,
      freelancers,
      projects,
      applications,
      avgProjectBudget: Math.round(avgProjectBudget)
    },
    categories: categoryAgg.map((x) => ({ category: x._id, jobs: x.jobs, avgBudget: Math.round(x.avgBudget || 0) })),
    skills: skillAgg.map((x) => ({ skill: x._id, demand: x.demand }))
  });
}
