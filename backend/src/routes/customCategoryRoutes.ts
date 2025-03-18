// import express from "express";
// import {
//   createCustomCategory,
//   getAllCustomCategories,
//   getArticlesByCustomCategory,
//   deleteCustomCategory,
//   getProgressStatus,
//   stopProcessingCategory,
// } from "../controllers/customCategoryController";
// import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

// const router = express.Router();

// // Create a new custom category
// router.post("/", authMiddleware, adminMiddleware, createCustomCategory);

// // Get all custom categories
// router.get("/", authMiddleware, adminMiddleware, getAllCustomCategories);

// // Get articles by custom category
// router.get(
//   "/:name",
//   authMiddleware,
//   adminMiddleware,
//   getArticlesByCustomCategory
// );

// // Get processing progress for a specific category
// router.get(
//   "/progress/:name",
//   authMiddleware,
//   adminMiddleware,
//   getProgressStatus
// );

// // Stop processing for a specific category
// router.post(
//   "/progress/stop/:name",
//   authMiddleware,
//   adminMiddleware,
//   stopProcessingCategory
// );

// // Delete a custom category
// router.delete("/:id", authMiddleware, adminMiddleware, deleteCustomCategory);

// export default router;
