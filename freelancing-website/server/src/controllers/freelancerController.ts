import type { Response } from "express";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Project } from "../models/Project.js";
import { Milestone } from "../models/Milestone.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function getFreelancerDashboard(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "freelancer") {
    return res.status(403).json({ message: "Freelancer access required." });
  }

  const userId = req.user.id;

  // Fetch the freelancer's skills for matching
  const user = await User.findById(userId).select("skills").lean();
  const userSkills: string[] = user?.skills ?? [];

  // Run all queries in parallel
  const [activeProjectsCount, applicationsCount, newResponsesCount, freelancerProjects] =
    await Promise.all([
      Project.countDocuments({ freelancerId: userId, status: { $in: ["created", "in-progress"] } }),
      Application.countDocuments({ freelancerId: userId }),
      Application.countDocuments({
        freelancerId: userId,
        status: { $in: ["shortlisted", "accepted"] }
      }),
      Project.find({ freelancerId: userId }).select("_id").lean()
    ]);

  // Total earned: sum of approved milestone amounts across freelancer's projects
  const projectIds = freelancerProjects.map((p) => p._id);
  let totalEarned = 0;
  if (projectIds.length > 0) {
    const earningsAgg = await Milestone.aggregate([
      { $match: { projectId: { $in: projectIds }, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    totalEarned = earningsAgg[0]?.total ?? 0;
  }

  // Recommended jobs: skill-matched open jobs, falling back to newest open jobs
  let recommendedJobs = await Job.find({
    status: "open",
    ...(userSkills.length > 0 ? { skills: { $in: userSkills } } : {})
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // If skill match returned nothing, fall back to newest open jobs
  if (recommendedJobs.length === 0 && userSkills.length > 0) {
    recommendedJobs = await Job.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  }

  // Calculate match percentage for each recommended job based on skill overlap
  const jobsWithMatch = recommendedJobs.map((job) => {
    const jobSkills = job.skills ?? [];
    if (jobSkills.length === 0 || userSkills.length === 0) {
      return { ...job, matchPercent: 0 };
    }
    const overlap = jobSkills.filter((s: string) =>
      userSkills.some((us) => us.toLowerCase() === s.toLowerCase())
    ).length;
    const matchPercent = Math.round((overlap / jobSkills.length) * 100);
    return { ...job, matchPercent };
  });

  // Sort by match percentage descending
  jobsWithMatch.sort((a, b) => b.matchPercent - a.matchPercent);

  return res.json({
    activeProjectsCount,
    applicationsCount,
    newResponsesCount,
    totalEarned,
    recommendedJobs: jobsWithMatch
  });
}
