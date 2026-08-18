import type { Response } from "express";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function getEmployerDashboard(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Employer access required." });
  }

  const jobs = await Job.find({ employerId: req.user.id }).sort({ createdAt: -1 }).lean();
  const jobIds = jobs.map((job) => job._id);

  const applications = await Application.find({ jobId: { $in: jobIds } })
    .populate("freelancerId", "name headline location skills rating completedProjects")
    .populate("jobId", "title company budgetMin budgetMax")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const stats = {
    totalJobs: jobs.length,
    openJobs: jobs.filter((job) => job.status === "open").length,
    activeProjects: jobs.filter((job) => job.status === "in-progress").length,
    totalApplications: applications.length,
    shortlisted: applications.filter((app) => app.status === "shortlisted").length
  };

  return res.json({ jobs, applications, stats });
}
