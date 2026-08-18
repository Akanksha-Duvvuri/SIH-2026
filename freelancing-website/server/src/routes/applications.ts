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

/**
 * @openapi
 * /api/applications/job/{jobId}:
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *               bidAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post("/job/:jobId", requireAuth, createApplication);

/**
 * @openapi
 * /api/applications/me:
 *   get:
 *     summary: Get freelancer's job applications
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of freelancer applications
 */
router.get("/me", requireAuth, getMyApplications);

/**
 * @openapi
 * /api/applications/employer:
 *   get:
 *     summary: Get applications received by the employer
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of received applications
 */
router.get("/employer", requireAuth, getEmployerApplications);

/**
 * @openapi
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status (Accept / Reject)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Application status updated
 */
router.patch("/:id/status", requireAuth, updateApplicationStatus);

/**
 * @openapi
 * /api/applications/{id}/withdraw:
 *   patch:
 *     summary: Withdraw a submitted application
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application withdrawn
 */
router.patch("/:id/withdraw", requireAuth, withdrawApplication);

export default router;
