import { Request, Response, Router } from "express";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware";
import {
  getAvailableModelAuthors,
  handleChatRequest,
} from "../controllers/chatController";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, handleChatRequest);
router.get("/", authMiddleware, adminMiddleware, getAvailableModelAuthors);

export default router;
