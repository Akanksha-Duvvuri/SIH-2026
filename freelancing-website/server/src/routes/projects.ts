import { Router } from "express";
import { getMyProjects,getProject,updateProject } from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
const router=Router();router.get("/mine",requireAuth,getMyProjects);router.get("/:id",requireAuth,getProject);router.patch("/:id",requireAuth,updateProject);export default router;
