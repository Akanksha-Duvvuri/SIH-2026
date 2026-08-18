import { Router } from "express";
import { getFreelancer, getFreelancers, getMyProfile, updateMyProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * @openapi
 * /api/profile/me:
 *   get:
 *     summary: Get profile details of current logged-in user
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *   patch:
 *     summary: Update profile details of current user
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, updateMyProfile);

/**
 * @openapi
 * /api/profile/freelancers:
 *   get:
 *     summary: List or search public freelancer profiles
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: List of freelancers
 */
router.get("/freelancers", getFreelancers);

/**
 * @openapi
 * /api/profile/freelancers/{id}:
 *   get:
 *     summary: Get public profile of a freelancer by ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Freelancer profile
 */
router.get("/freelancers/:id", getFreelancer);

export default router;
