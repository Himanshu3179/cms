import { Router } from "express";
import {
  editFeed,
  getFeedById,
  getFeeds,
} from "../controllers/feedsController";
import { aiQueryFeeds } from "../controllers/aiFeedController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getFeeds);
router.get("/ai-query", authMiddleware, adminMiddleware, aiQueryFeeds);

// get article by id
router.get("/:id", authMiddleware, adminMiddleware, getFeedById);

//edit article by id

router.put("/:id", authMiddleware, adminMiddleware, editFeed);

export default router;
