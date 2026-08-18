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

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     summary: List all open jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 *   post:
 *     summary: Create a new job post
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, budget]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *               category:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.get("/", listJobs);
router.post("/", requireAuth, createJob);

/**
 * @openapi
 * /api/jobs/mine:
 *   get:
 *     summary: Get jobs created by the current employer
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Employer's posted jobs
 */
router.get("/mine", requireAuth, getMyJobs);

/**
 * @openapi
 * /api/jobs/{id}:
 *   get:
 *     summary: Get details of a single job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *   patch:
 *     summary: Update an existing job
 *     tags: [Jobs]
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
 *         description: Job updated successfully
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Jobs]
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
 *         description: Job deleted successfully
 */
router.get("/:id", getJob);
router.patch("/:id", requireAuth, updateJob);
router.delete("/:id", requireAuth, deleteJob);

export default router;
