import { Router } from "express";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/", requireAuth, getNotifications);
router.patch("/:id/read", requireAuth, markNotificationRead);
router.patch("/read-all", requireAuth, markAllNotificationsRead);
export default router;
