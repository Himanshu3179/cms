import express from "express";
import {
  createAdminArticle,
  getAdminArticles,
  getAdminArticleById,
  updateAdminArticle,
  deleteAdminArticle,
  getAdminArticlesByUserId,
} from "../controllers/adminArticleController";

const router = express.Router();

// Get all admin articles
router.get("/", getAdminArticles);

// Get a specific admin article by ID
router.get("/:id", getAdminArticleById);

// getAdminArticlesByUserId
router.get(
  "/user/:id",

  getAdminArticlesByUserId
);

// Create a new admin article (protected, admin access required)
router.post("/", createAdminArticle);

// Update an admin article (protected, admin access required)
router.put("/:id", updateAdminArticle);

// Delete an admin article (protected, admin access required)
router.delete("/:id", deleteAdminArticle);

export default router;
