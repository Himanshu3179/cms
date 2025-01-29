import { Router } from "express";
import { getFeedById, getFeeds } from "../controllers/feedsController";

import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getFeeds);

// get article by id
router.get("/:id", authMiddleware, adminMiddleware, getFeedById);

export default router;