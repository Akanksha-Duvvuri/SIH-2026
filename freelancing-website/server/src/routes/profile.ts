import { Router } from "express";
import { getFreelancer,getFreelancers,getMyProfile,updateMyProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";
const router=Router();
router.get("/me",requireAuth,getMyProfile);router.patch("/me",requireAuth,updateMyProfile);router.get("/freelancers",getFreelancers);router.get("/freelancers/:id",getFreelancer);export default router;
