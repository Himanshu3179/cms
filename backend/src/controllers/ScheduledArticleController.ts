import { Request, Response } from "express";
import { ScheduledArticle } from "../models/ScheduledArticle";

// Get all scheduled articles
export const getScheduledArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await ScheduledArticle.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scheduled articles", error });
  }
};

// Get a scheduled article by ID
export const getScheduledArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await ScheduledArticle.findById(req.params.id);
    if (!article) {
      res.status(404).json({ message: "Scheduled article not found" });
      return;
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scheduled article", error });
  }
};

// Create a new scheduled article
export const createScheduledArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const newArticle = new ScheduledArticle(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "Error creating scheduled article", error });
  }
};

// Update a scheduled article
export const updateScheduledArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedArticle = await ScheduledArticle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArticle) {
      res.status(404).json({ message: "Scheduled article not found" });
      return;
    }
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Error updating scheduled article", error });
  }
};

// Delete a scheduled article
export const deleteScheduledArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedArticle = await ScheduledArticle.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      res.status(404).json({ message: "Scheduled article not found" });
      return;
    }
    res.json({ message: "Scheduled article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting scheduled article", error });
  }
};