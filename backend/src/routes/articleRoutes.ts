import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getPublishedAdminArticleById,
  getArticlesByUserId,
} from "../controllers/articleController";
import {
  authMiddleware,
  adminMiddleware,
  writerMiddleware,
} from "../middleware/authMiddleware";

const router = express.Router();

// Get all articles (including user-created and fetched ones)
router.get("/", getArticles);

// Get a specific article by ID
router.get("/:id", authMiddleware, getArticleById);

// get published admin article by id
router.get("/published/:id", authMiddleware, getPublishedAdminArticleById);

// Get articles by user ID
router.get("/user/:userId", authMiddleware, getArticlesByUserId);

// Create a new article (protected, writer access required)
router.post("/", authMiddleware, writerMiddleware, createArticle);

// Update an article (protected, writer access required)
router.put("/:id", authMiddleware, writerMiddleware, updateArticle);

// Delete an article (protected, writer access required)
router.delete("/:id", authMiddleware, writerMiddleware, deleteArticle);

// Admin-only route to delete any article
router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteArticle);

export default router;
