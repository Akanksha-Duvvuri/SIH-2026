import { Router } from "express";
import { createMilestone, listMilestones, submitMilestone, updateMilestone } from "../controllers/milestoneController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/project/:projectId", requireAuth, listMilestones);
router.post("/project/:projectId", requireAuth, createMilestone);
router.patch("/:id/submit", requireAuth, submitMilestone);
router.patch("/:id", requireAuth, updateMilestone);
export default router;
