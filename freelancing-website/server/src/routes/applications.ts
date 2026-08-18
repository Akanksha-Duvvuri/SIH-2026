import { Router } from "express";
import {
  createApplication,
  getEmployerApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/job/:jobId", requireAuth, createApplication);
router.get("/me", requireAuth, getMyApplications);
router.get("/employer", requireAuth, getEmployerApplications);
router.patch("/:id/status", requireAuth, updateApplicationStatus);
router.patch("/:id/withdraw", requireAuth, withdrawApplication);

export default router;
