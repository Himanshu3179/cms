import express from "express";
import {
  updateUserRole,
  getAllUsers,
  getAllUserArticles,
  getUserArticlesById,
} from "../controllers/adminController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Update user role (admin only)
router.post("/update-role", authMiddleware, adminMiddleware, updateUserRole);

// Get all users (admin only)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// get al user articles
router.get(
  "/user-articles",
  authMiddleware,
  adminMiddleware,
  getAllUserArticles
);

// get user article by id
router.get(
  "/user-articles/:id",
  authMiddleware,
  adminMiddleware,
  getUserArticlesById
);

export default router;
