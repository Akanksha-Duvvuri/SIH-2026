import { Router } from "express";
import { createPortfolioItem,deletePortfolioItem,listMyPortfolio,updatePortfolioItem } from "../controllers/portfolioController.js";
import { requireAuth } from "../middleware/auth.js";
const router=Router();router.get("/me",requireAuth,listMyPortfolio);router.post("/",requireAuth,createPortfolioItem);router.patch("/:id",requireAuth,updatePortfolioItem);router.delete("/:id",requireAuth,deletePortfolioItem);export default router;
