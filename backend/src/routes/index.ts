import { Router } from "express";
import feedsRoutes from "./feedsRoutes";
import filtersRoutes from "./filtersRoutes";
import articleRoutes from "./articleRoutes";
import userRoutes from "./userRoutes";
import adminArticleRoutes from "./adminArticleRoutes";
import adminRoutes from "./adminRoutes";
import chatRoutes from "./chatRoutes";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware";
import aiArticlesGeneratorRoutes from "./aiArticlesGeneratorRoutes";
import aiArticlesRoutes from "./aiArticlesRoutes"; // Import the new route

const router = Router();

// Feeds routes
router.use("/feeds", feedsRoutes);

// Filters routes
router.use("/filters", filtersRoutes);

// Article routes
router.use("/articles", articleRoutes);

// User routes
router.use("/users", userRoutes);

// Admin article routes
router.use(
  "/admin-articles",
  authMiddleware,
  adminMiddleware,
  adminArticleRoutes
);

// Admin routes
router.use("/admin", adminRoutes);

// Chat routes
router.use("/chat", chatRoutes);

// Custom category routes
// router.use("/custom-categories", customCategoryRoutes);

// AI articles generator routes
router.use("/ai-articles", aiArticlesGeneratorRoutes);

// AI articles routes
router.use("/ai-generated-articles", aiArticlesRoutes); // Add the new route

export default router;
