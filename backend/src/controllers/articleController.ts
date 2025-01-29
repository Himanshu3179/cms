import { Response } from "express";
import { Article } from "../models/Article";
import { CustomRequest } from "../../types/express";
import { AdminArticle } from "../models/AdminArticle";
import { Article as ArticleType } from "../../types/article"; // Import the Article type

// Get all published admin articles
export const getArticles = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    // send only published articles in descending order
    const articles = await AdminArticle.find({
      isPublished: true,
    }).sort({ updatedAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

// Get a published admin article by ID
export const getPublishedAdminArticleById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const article = await AdminArticle.findOne({
      _id: req.params.id,
      isPublished: true,
    }).sort({ updatedAt: -1 });
    if (!article) {
      res.status(404).json({ message: "Published article not found" });
      return;
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch published article" });
  }
};

// Get an article by ID
export const getArticleById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    if (!req.user || article.userId.toString() !== req.user.id) {
      article = await AdminArticle.findById(req.params.id);
    }
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

// Create a new article
export const createArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, sourceUrl }: ArticleType = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    if (!sourceUrl) missingFields.push("sourceUrl");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    const newArticle = new Article({
      title,
      description,
      category,
      sourceUrl,
      userId: req.user.id,
    });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create article", error: error.message });
  }
};

// Update an article
export const updateArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    if (!req.user || article.userId.toString() !== req.user.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { title, description, category }: Partial<ArticleType> = req.body;
    article.title = title || article.title;
    article.description = description || article.description;
    article.category = category || article.category;

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update article" });
  }
};

// Delete an article
export const deleteArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    if (!req.user || article.userId.toString() !== req.user.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await article.deleteOne();
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article" });
  }
};

// Get articles by user ID
export const getArticlesByUserId = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const articles = await Article.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};