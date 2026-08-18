import { Router } from "express";
import { listProjectMessages, sendProjectMessage } from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/project/:projectId", requireAuth, listProjectMessages);
router.post("/project/:projectId", requireAuth, sendProjectMessage);
export default router;
