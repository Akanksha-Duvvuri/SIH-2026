import { Router } from "express";
import {
  createJob,
  deleteJob,
  getJob,
  getMyJobs,
  listJobs,
  updateJob
} from "../controllers/jobController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", listJobs);
router.get("/mine", requireAuth, getMyJobs);
router.get("/:id", getJob);
router.post("/", requireAuth, createJob);
router.patch("/:id", requireAuth, updateJob);
router.delete("/:id", requireAuth, deleteJob);

export default router;
