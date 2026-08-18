import { Router } from "express";
import { getMyProjects, getProject, updateProject } from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * @openapi
 * /api/projects/mine:
 *   get:
 *     summary: List projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User projects list
 */
router.get("/mine", requireAuth, getMyProjects);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     summary: Get details of a project by ID
 *     tags: [Projects]
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
 *         description: Project details
 *   patch:
 *     summary: Update project status or details
 *     tags: [Projects]
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
 *         description: Project updated
 */
router.get("/:id", requireAuth, getProject);
router.patch("/:id", requireAuth, updateProject);

export default router;
