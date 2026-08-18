import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
const router = Router();
router.get("/marketplace", getAnalytics);
export default router;
