import { Router } from "express";
import {
  getScheduledArticles,
  getScheduledArticleById,
  createScheduledArticle,
  updateScheduledArticle,
  deleteScheduledArticle,
} from "../controllers/ScheduledArticleController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Protect routes with authMiddleware if needed
router.get("/", authMiddleware, getScheduledArticles);
router.get("/:id", authMiddleware, getScheduledArticleById);
router.post("/", authMiddleware, createScheduledArticle);
router.put("/:id", authMiddleware, updateScheduledArticle);
router.delete("/:id", authMiddleware, deleteScheduledArticle);

export default router;
