import type { Response } from "express";
import { Job } from "../models/Job.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function listJobs(req: AuthRequest, res: Response) {
  const { search = "", category, workMode, experienceLevel, minBudget, maxBudget } = req.query;
  const filter: Record<string, any> = { status: "open" };

  if (category && category !== "All") filter.category = category;
  if (workMode && workMode !== "All") filter.workMode = workMode;
  if (experienceLevel && experienceLevel !== "All") filter.experienceLevel = experienceLevel;
  if (minBudget) filter.budgetMax = { $gte: Number(minBudget) };
  if (maxBudget) filter.budgetMin = { ...(filter.budgetMin || {}), $lte: Number(maxBudget) };
  if (String(search).trim()) filter.$text = { $search: String(search).trim() };

  const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
  return res.json({ jobs });
}

export async function getJob(req: AuthRequest, res: Response) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found." });
  return res.json({ job });
}

export async function getMyJobs(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can access their jobs." });
  }
  const jobs = await Job.find({ employerId: req.user.id }).sort({ createdAt: -1 });
  return res.json({ jobs });
}

export async function createJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can post jobs." });
  }

  const {
    title, company, description, category, skills,
    budgetMin, budgetMax, duration, experienceLevel, location, workMode
  } = req.body;

  if (
    !title || !company || !description || !category ||
    !Array.isArray(skills) || !skills.length ||
    Number(budgetMin) < 0 || Number(budgetMax) <= 0 ||
    !duration || !experienceLevel
  ) {
    return res.status(400).json({ message: "Please complete all required job fields." });
  }

  if (Number(budgetMin) > Number(budgetMax)) {
    return res.status(400).json({ message: "Minimum budget cannot exceed maximum budget." });
  }

  const job = await Job.create({
    employerId: req.user.id,
    title: title.trim(),
    company: company.trim(),
    description: description.trim(),
    category,
    skills: skills.map((skill: string) => skill.trim()).filter(Boolean),
    budgetMin: Number(budgetMin),
    budgetMax: Number(budgetMax),
    duration,
    experienceLevel,
    location: location || "India",
    workMode: workMode || "Remote"
  });

  return res.status(201).json({ job });
}

export async function updateJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can edit jobs." });
  }

  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found." });
  if (job.employerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You do not own this job." });
  }

  const allowed = [
    "title", "company", "description", "category", "skills",
    "budgetMin", "budgetMax", "duration", "experienceLevel",
    "location", "workMode", "status"
  ];

  for (const key of allowed) {
    if (req.body[key] !== undefined) (job as any)[key] = req.body[key];
  }

  await job.save();
  return res.json({ job });
}

export async function deleteJob(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Only employers can delete jobs." });
  }

  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found." });
  if (job.employerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You do not own this job." });
  }

  await job.deleteOne();
  return res.json({ message: "Job deleted." });
}
