import { Router } from "express";
import { createJob, getJob, listJobs } from "../controllers/jobController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", listJobs);
router.get("/:id", getJob);
router.post("/", requireAuth, createJob);

export default router;
