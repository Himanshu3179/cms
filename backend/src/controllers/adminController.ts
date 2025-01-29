import { Request, Response } from "express";
import { User } from "../models/User";
import { Article } from "../models/Article";

// Update user role
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, newRole } = req.body;
    const validRoles = ["admin", "writer", "viewer"];
    if (!validRoles.includes(newRole)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prevent assigning a lower role to an admin
    if (user.role === "admin" && newRole !== "admin") {
      res
        .status(400)
        .json({ message: "Cannot assign a lower role to an admin" });
      return;
    }

    user.role = newRole;
    await user.save();
    res.json({ message: `User role updated to ${newRole}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role" });
  }
};

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ _id: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get all user articles
export const getAllUserArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const articles = await Article.find().sort({ updatedAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

// Get user article by id
export const getUserArticlesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch article" });
  }
};