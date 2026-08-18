import { Notification } from "../models/Notification.js";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  return Notification.create(data);
}
