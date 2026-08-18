import type { Response } from "express";
import { Job } from "../models/Job.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function listJobs(req: AuthRequest, res: Response) {
  const {
    search = "",
    category,
    workMode,
    experienceLevel,
    minBudget,
    maxBudget
  } = req.query;

  const filter: Record<string, any> = { status: "open" };

  if (category && category !== "All") filter.category = category;
  if (workMode && workMode !== "All") filter.workMode = workMode;
  if (experienceLevel && experienceLevel !== "All") filter.experienceLevel = experienceLevel;

  if (minBudget) filter.budgetMax = { $gte: Number(minBudget) };
  if (maxBudget) filter.budgetMin = { ...(filter.budgetMin || {}), $lte: Number(maxBudget) };

  if (String(search).trim()) {
    filter.$text = { $search: String(search).trim() };
  }

  const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
  return res.json({ jobs });
}

export async function getJob(req: AuthRequest, res: Response) {
  const job = await Job.findById(req.params.id);

  if (!job) return res.status(404).json({ message: "Job not found." });

  return res.json({ job });
}

export async function createJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can post jobs." });
  }

  const job = await Job.create({
    ...req.body,
    employerId: req.user.id
  });

  return res.status(201).json({ job });
}
