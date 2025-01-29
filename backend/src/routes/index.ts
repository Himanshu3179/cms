import { Router } from "express";
import feedsRoutes from "./feedsRoutes";
import filtersRoutes from "./filtersRoutes";
import articleRoutes from "./articleRoutes";
import userRoutes from "./userRoutes";
import adminArticleRoutes from "./adminArticleRoutes";
import adminRoutes from "./adminRoutes";

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
router.use("/admin-articles", adminArticleRoutes);

// Admin routes
router.use("/admin", adminRoutes);

export default router;
