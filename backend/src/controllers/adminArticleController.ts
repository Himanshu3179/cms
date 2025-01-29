import { Response } from "express";
import { AdminArticle } from "../models/AdminArticle";
import { CustomRequest } from "../../types/express"; // Import the custom Request type

// Get all admin articles
export const getAdminArticles = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const adminArticles = await AdminArticle.find().sort({ updatedAt: -1 });
    res.json(adminArticles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin articles" });
  }
};

// Get an admin article by ID
export const getAdminArticleById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const adminArticle = await AdminArticle.findById(req.params.id);
    if (!adminArticle) {
      res.status(404).json({ message: "Admin article not found" });
      return;
    }
    res.json(adminArticle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin article" });
  }
};

// Create a new admin article
export const createAdminArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, sourceUrl } = req.body;
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const newAdminArticle = new AdminArticle({
      title,
      description,
      category,
      sourceUrl,
      userId: req.user.id,
      isPublished:
        req.body.isPublished !== undefined ? req.body.isPublished : true,
    });
    const savedAdminArticle = await newAdminArticle.save();
    res.status(201).json(savedAdminArticle);
  } catch (error) {
    res.status(500).json({ message: "Failed to create admin article" });
  }
};

// Update an admin article
export const updateAdminArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const adminArticle = await AdminArticle.findById(req.params.id);
    if (!adminArticle) {
      res.status(404).json({ message: "Admin article not found" });
      return;
    }
    const { title, description, category, sourceUrl, isPublished } = req.body;
    adminArticle.title = title || adminArticle.title;
    adminArticle.description = description || adminArticle.description;
    adminArticle.category = category || adminArticle.category;
    if (sourceUrl !== undefined) {
      adminArticle.sourceUrl = sourceUrl;
    }
    if (isPublished !== undefined) {
      adminArticle.isPublished = isPublished;
    }

    const updatedAdminArticle = await adminArticle.save();
    res.json(updatedAdminArticle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update admin article" });
  }
};

// Delete an admin article
export const deleteAdminArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const adminArticle = await AdminArticle.findById(req.params.id);
    if (!adminArticle) {
      res.status(404).json({ message: "Admin article not found" });
      return;
    }

    await adminArticle.deleteOne();
    res.json({ message: "Admin article deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin article" });
  }
};

// getAdminArticlesByUserId

export const getAdminArticlesByUserId = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const adminArticles = await AdminArticle.find({ userId: req.user?.id }).sort({ updatedAt: -1 });
    res.json(adminArticles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin articles" });
  }
};
