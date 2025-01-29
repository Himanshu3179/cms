import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserArticles,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Get user profile (protected route)
router.get("/profile", authMiddleware, getUserProfile);

// get user's articles
router.get("/articles", authMiddleware, getUserArticles);

export default router;
