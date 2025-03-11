import { Request, Response } from "express";
import { AiArticles } from "../models/AiArticles";

// Get all AI-generated articles
export const getAiArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const aiArticles = await AiArticles.find().sort({ processedAt: -1 });
    res.json(aiArticles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch AI-generated articles" });
  }
};

// Get a specific AI-generated article by ID
export const getAiArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const aiArticle = await AiArticles.findById(req.params.id);
    if (!aiArticle) {
      res.status(404).json({ message: "AI-generated article not found" });
      return;
    }
    res.json(aiArticle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch AI-generated article" });
  }
};
