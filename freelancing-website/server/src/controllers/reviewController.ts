import type { Response } from "express";
import { Review } from "../models/Review.js";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import type { AuthRequest } from "../middleware/auth.js";
import { createNotification } from "../utils/notify.js";

export async function listProjectReviews(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: "Project not found." });
  if (project.employerId.toString() !== req.user.id && project.freelancerId.toString() !== req.user.id) return res.status(403).json({ message: "Access denied." });
  const reviews = await Review.find({ projectId: project._id }).populate("reviewerId", "name role").sort({ createdAt: -1 });
  return res.json({ reviews });
}

export async function createReview(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: "Project not found." });
  if (project.status !== "completed") return res.status(400).json({ message: "Reviews are available after project completion." });

  const revieweeId = project.employerId.toString() === req.user.id ? project.freelancerId : project.employerId;
  const { rating, comment } = req.body;
  if (Number(rating) < 1 || Number(rating) > 5 || !comment?.trim()) return res.status(400).json({ message: "Rating from 1-5 and a comment are required." });

  const existing = await Review.findOne({ projectId: project._id, reviewerId: req.user.id });
  if (existing) return res.status(409).json({ message: "You already reviewed this project." });

  const review = await Review.create({ projectId: project._id, reviewerId: req.user.id, revieweeId, rating: Number(rating), comment: comment.trim() });

  const reviews = await Review.find({ revieweeId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await User.findByIdAndUpdate(revieweeId, { rating: Number(avg.toFixed(1)) });
  await createNotification({ userId: revieweeId.toString(), type: "review-received", title: "New review received", message: "A completed project now has a new review.", link: `/projects/${project._id}` });

  return res.status(201).json({ review });
}
