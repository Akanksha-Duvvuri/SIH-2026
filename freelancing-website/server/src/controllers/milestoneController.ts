import mongoose from "mongoose";
import type { Response } from "express";
import { Milestone } from "../models/Milestone.js";
import { Project } from "../models/Project.js";
import { Transaction } from "../models/Transaction.js";
import type { AuthRequest } from "../middleware/auth.js";
import { createNotification } from "../utils/notify.js";

async function getAuthorizedProject(id: string, userId: string) {
  const project = await Project.findById(id);
  if (!project) return null;
  if (project.employerId.toString() !== userId && project.freelancerId.toString() !== userId) return null;
  return project;
}

export async function listMilestones(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const projectId = String(req.params.projectId);
  if (!mongoose.isValidObjectId(projectId)) return res.status(400).json({ message: "Invalid project ID." });
  const project = await getAuthorizedProject(projectId, req.user.id);
  if (!project) return res.status(404).json({ message: "Project not found." });
  const milestones = await Milestone.find({ projectId: project._id }).sort({ createdAt: 1 });
  const transactions = await Transaction.find({ projectId: project._id }).sort({ createdAt: -1 });
  return res.json({ milestones, transactions });
}

export async function createMilestone(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") return res.status(403).json({ message: "Only employers can create milestones." });
  const projectId = String(req.params.projectId);
  const project = await getAuthorizedProject(projectId, req.user.id);
  if (!project) return res.status(404).json({ message: "Project not found." });
  const { title, description, amount, dueDate } = req.body;
  if (!title?.trim() || !description?.trim() || Number(amount) <= 0) return res.status(400).json({ message: "Title, description and valid amount are required." });
  const milestone = await Milestone.create({ projectId: project._id, title: title.trim(), description: description.trim(), amount: Number(amount), dueDate: dueDate || undefined });
  return res.status(201).json({ milestone });
}

export async function submitMilestone(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "freelancer") return res.status(403).json({ message: "Only freelancers can submit milestones." });
  const milestone = await Milestone.findById(req.params.id);
  if (!milestone) return res.status(404).json({ message: "Milestone not found." });
  const project = await getAuthorizedProject(milestone.projectId.toString(), req.user.id);
  if (!project || project.freelancerId.toString() !== req.user.id) return res.status(403).json({ message: "Access denied." });
  const deliverable = String(req.body.deliverable || "").trim();
  if (!deliverable) return res.status(400).json({ message: "Add a deliverable description or link." });
  milestone.deliverable = deliverable;
  milestone.status = "submitted";
  milestone.submittedAt = new Date();
  await milestone.save();
  await createNotification({ userId: project.employerId.toString(), type: "milestone-submitted", title: "Milestone submitted", message: `${milestone.title} is ready for review.`, link: `/projects/${project._id}` });
  return res.json({ milestone });
}

export async function updateMilestone(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const milestone = await Milestone.findById(req.params.id);
  if (!milestone) return res.status(404).json({ message: "Milestone not found." });
  const project = await getAuthorizedProject(milestone.projectId.toString(), req.user.id);
  if (!project) return res.status(403).json({ message: "Access denied." });

  const status = String(req.body.status || "");
  if (status === "revision") {
    if (project.employerId.toString() !== req.user.id) return res.status(403).json({ message: "Only the employer can request a revision." });
    milestone.status = "revision";
    await milestone.save();
    await createNotification({ userId: project.freelancerId.toString(), type: "revision-requested", title: "Revision requested", message: `Please revise ${milestone.title}.`, link: `/projects/${project._id}` });
    return res.json({ milestone });
  }

  if (status === "approved") {
    if (project.employerId.toString() !== req.user.id) return res.status(403).json({ message: "Only the employer can approve a milestone." });
    if (milestone.status !== "submitted") return res.status(400).json({ message: "Only submitted milestones can be approved." });

    milestone.status = "approved";
    milestone.approvedAt = new Date();
    await milestone.save();

    const reference = `MS-${milestone._id.toString().slice(-8).toUpperCase()}-${Date.now()}`;
    await Transaction.create({ projectId: project._id, milestoneId: milestone._id, type: "milestone-release", amount: milestone.amount, status: "completed", reference });

    const all = await Milestone.find({ projectId: project._id });
    const allApproved = all.length > 0 && all.every((m) => m.status === "approved");
    project.escrowStatus = allApproved ? "released" : "partially-released";
    if (allApproved) project.status = "completed";
    await project.save();

    await createNotification({ userId: project.freelancerId.toString(), type: "milestone-approved", title: "Milestone approved", message: `₹${milestone.amount.toLocaleString("en-IN")} released for ${milestone.title}.`, link: `/projects/${project._id}` });
    return res.json({ milestone, project });
  }

  return res.status(400).json({ message: "Unsupported milestone action." });
}
