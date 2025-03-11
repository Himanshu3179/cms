import { Router } from "express";
import {
  getAiArticles,
  getAiArticleById,
} from "../controllers/aiArticlesController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Get all AI-generated articles
router.get("/", authMiddleware, adminMiddleware, getAiArticles);

// Get a specific AI-generated article by ID
router.get("/:id", authMiddleware, adminMiddleware, getAiArticleById);

export default router;
