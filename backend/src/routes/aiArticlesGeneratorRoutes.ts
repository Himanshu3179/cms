import { Router } from "express";
import { generateMultipleAiArticles } from "../controllers/aiArticlesGeneratorController";

const router = Router();

router.post("/generate-multiple", generateMultipleAiArticles);

export default router;
