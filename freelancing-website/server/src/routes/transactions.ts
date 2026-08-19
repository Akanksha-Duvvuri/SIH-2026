import { Router } from "express";
import {
  fundProject,
  getProjectTransactions,
  releaseRemainingProjectPayment,
} from "../controllers/transactionController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/project/:projectId", requireAuth, getProjectTransactions);
router.post("/project/:projectId/fund", requireAuth, fundProject);
router.post(
  "/project/:projectId/release",
  requireAuth,
  releaseRemainingProjectPayment
);

export default router;
