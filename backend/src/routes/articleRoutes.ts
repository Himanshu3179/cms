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

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Get a specific article by ID
router.get("/:id", getArticleById);

// get published admin article by id
router.get("/published/:id", getPublishedAdminArticleById);

// Get articles by user ID
router.get("/user/:userId", getArticlesByUserId);

// Create a new article (protected, writer access required)
router.post("/", writerMiddleware, createArticle);

// Update an article (protected, writer access required)
router.put("/:id", writerMiddleware, updateArticle);

// Delete an article (protected, writer access required)
router.delete("/:id", writerMiddleware, deleteArticle);

// Admin-only route to delete any article
router.delete("/admin/:id", adminMiddleware, deleteArticle);

export default router;
