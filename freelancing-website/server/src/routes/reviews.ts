import { Router } from "express";
import { createReview, listProjectReviews } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/project/:projectId", requireAuth, listProjectReviews);
router.post("/project/:projectId", requireAuth, createReview);
export default router;
