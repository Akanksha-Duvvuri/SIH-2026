import type { Response } from "express";
import { Message } from "../models/Message.js";
import { Project } from "../models/Project.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function listProjectMessages(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: "Project not found." });
  if (project.employerId.toString() !== req.user.id && project.freelancerId.toString() !== req.user.id) return res.status(403).json({ message: "Access denied." });
  const messages = await Message.find({ projectId: project._id }).populate("senderId", "name role").sort({ createdAt: 1 }).limit(200);
  return res.json({ messages });
}

export async function sendProjectMessage(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: "Project not found." });
  const isEmployer = project.employerId.toString() === req.user.id;
  const isFreelancer = project.freelancerId.toString() === req.user.id;
  if (!isEmployer && !isFreelancer) return res.status(403).json({ message: "Access denied." });
  const content = String(req.body.content || "").trim();
  if (!content) return res.status(400).json({ message: "Message cannot be empty." });
  const recipientId = isEmployer ? project.freelancerId : project.employerId;
  const message = await Message.create({ projectId: project._id, senderId: req.user.id, recipientId, content });
  return res.status(201).json({ message });
}
