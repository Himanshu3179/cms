import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { Article } from "../models/Article";

// Register user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    // Check if the user already exists with the same username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    // Check if the user already exists with the same email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "This email is not registered" });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Failed to login user" });
  }
};

// Get user profile
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// Get user articles
export const getUserArticles = async (
  req: Request,
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
    res.status(500).json({ message: "Failed to fetch user articles" });
  }
};
