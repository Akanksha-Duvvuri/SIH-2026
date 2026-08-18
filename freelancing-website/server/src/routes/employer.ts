import { Router } from "express";
import { getEmployerDashboard } from "../controllers/employerController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/dashboard", requireAuth, getEmployerDashboard);

export default router;
