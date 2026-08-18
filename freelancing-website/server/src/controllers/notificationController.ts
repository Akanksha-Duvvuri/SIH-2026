import type { Response } from "express";
import { Notification } from "../models/Notification.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function getNotifications(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  return res.json({ notifications });
}

export async function markNotificationRead(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { read: true }, { new: true });
  if (!notification) return res.status(404).json({ message: "Notification not found." });
  return res.json({ notification });
}

export async function markAllNotificationsRead(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  await Notification.updateMany({ userId: req.user.id, read: false }, { $set: { read: true } });
  return res.json({ message: "Notifications marked as read." });
}
