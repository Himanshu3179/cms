import express from "express";
import {
  createAdminArticle,
  getAdminArticles,
  getAdminArticleById,
  updateAdminArticle,
  deleteAdminArticle,
  getAdminArticlesByUserId,
} from "../controllers/adminArticleController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Get all admin articles
router.get("/", authMiddleware, adminMiddleware, getAdminArticles);

// Get a specific admin article by ID
router.get("/:id", authMiddleware, adminMiddleware, getAdminArticleById);

// getAdminArticlesByUserId
router.get(
  "/user/:id",
  authMiddleware,
  adminMiddleware,
  getAdminArticlesByUserId
);

// Create a new admin article (protected, admin access required)
router.post("/", authMiddleware, adminMiddleware, createAdminArticle);

// Update an admin article (protected, admin access required)
router.put("/:id", authMiddleware, adminMiddleware, updateAdminArticle);

// Delete an admin article (protected, admin access required)
router.delete("/:id", authMiddleware, adminMiddleware, deleteAdminArticle);

export default router;
