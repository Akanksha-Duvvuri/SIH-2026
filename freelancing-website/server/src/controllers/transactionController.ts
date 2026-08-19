import crypto from "node:crypto";
import type { Response } from "express";
import { Project } from "../models/Project.js";
import { Transaction } from "../models/Transaction.js";
import type { AuthRequest } from "../middleware/auth.js";

async function authorizedProject(projectId: string, userId: string) {
  const project = await Project.findById(projectId);
  if (!project) return null;

  if (
    project.employerId.toString() !== userId &&
    project.freelancerId.toString() !== userId
  ) {
    return null;
  }

  return project;
}

export async function getProjectTransactions(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const project = await authorizedProject(req.params.projectId, req.user.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  const transactions = await Transaction.find({
    projectId: project._id,
  }).sort({ createdAt: -1 });

  const released = transactions
    .filter((transaction) => transaction.type === "milestone-release")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const funded = transactions
    .filter((transaction) => transaction.type === "escrow-fund")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return res.json({
    transactions,
    summary: {
      funded,
      released,
      remaining: Math.max(funded - released, 0),
    },
  });
}

export async function fundProject(req: AuthRequest, res: Response) {
  if (!req.user || req.user.role !== "employer") {
    return res
      .status(403)
      .json({ message: "Only employers can fund projects." });
  }

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (project.employerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You do not own this project." });
  }

  if (project.escrowStatus !== "not-funded") {
    return res
      .status(400)
      .json({ message: "This project's escrow is already funded." });
  }

  await Transaction.create({
    projectId: project._id,
    type: "escrow-fund",
    amount: project.totalAmount,
    status: "completed",
    reference: `ESCROW-${crypto.randomUUID()}`,
  });

  project.escrowStatus = "funded";
  project.status = "in-progress";
  await project.save();

  return res.json({ project });
}

export async function releaseRemainingProjectPayment(
  req: AuthRequest,
  res: Response
) {
  if (!req.user || req.user.role !== "employer") {
    return res
      .status(403)
      .json({ message: "Only employers can release project payments." });
  }

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (project.employerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "You do not own this project." });
  }

  if (
    project.escrowStatus !== "funded" &&
    project.escrowStatus !== "partially-released"
  ) {
    return res
      .status(400)
      .json({ message: "Fund the project before releasing payment." });
  }

  const transactions = await Transaction.find({
    projectId: project._id,
    status: "completed",
  });

  const funded = transactions
    .filter((t) => t.type === "escrow-fund")
    .reduce((sum, t) => sum + t.amount, 0);

  const released = transactions
    .filter((t) => t.type === "milestone-release")
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = Math.max(funded - released, 0);

  if (remaining <= 0) {
    return res.status(400).json({ message: "No escrow balance remains." });
  }

  await Transaction.create({
    projectId: project._id,
    type: "milestone-release",
    amount: remaining,
    status: "completed",
    reference: `RELEASE-${crypto.randomUUID()}`,
  });

  project.escrowStatus = "released";
  project.status = "completed";
  await project.save();

  return res.json({ project });
}
