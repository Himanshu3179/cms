import { Request, Response } from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { CustomCategory } from "../models/CustomCategory";
import { Feed } from "../models/Feed";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let processingJobs: Record<
  string,
  { stopProcessing: boolean; progressPercentage: number }
> = {};

// Function to categorize an article
async function categorizeArticle(
  article: any,
  categoryName: string,
  categoryDescription: string
) {
  const prompt = `Does this article match the category "${categoryName}"?
  
  Category Description: ${categoryDescription}
  
  Article Title: "${article.title}"
  Article Description: "${article.description}"
  
  Answer "YES" or "NO":`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert in categorizing news articles.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 10,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0]?.message?.content?.trim().toUpperCase() === "YES";
}

// Create a new custom category and categorize articles with progress tracking
export const createCustomCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: "Name and description are required" });
      return;
    }

    let newCategory = await CustomCategory.findOne({ name });
    if (!newCategory) {
      newCategory = await CustomCategory.create({ name, description });
    }

    const totalArticles = await Feed.countDocuments({});
    const articles = await Feed.find({
      customCategory: { $ne: name },
      rejectedCategories: { $ne: name },
    });

    console.log(
      "Applying operations on:",
      articles.length,
      "articles out of",
      totalArticles
    );
    let affectedArticlesCount = 0;
    let processedArticles = totalArticles - articles.length;

    processingJobs[name] = { stopProcessing: false, progressPercentage: 0 };

    res.status(202).json({
      message: "Processing started",
      totalArticles,
      remainingArticles: articles.length,
    });

    const updateProgress = async () => {
      while (
        processedArticles < totalArticles &&
        !processingJobs[name].stopProcessing
      ) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        if (processingJobs[name]) {
          processingJobs[name].progressPercentage = parseFloat(
            ((processedArticles / totalArticles) * 100).toFixed(2)
          );
          console.log(
            `Processing Progress for ${name}: ${processingJobs[name].progressPercentage}%`
          );
        }
      }
    };

    updateProgress();

    for (const article of articles) {
      if (processingJobs[name].stopProcessing) break;

      const isMatch = await categorizeArticle(article, name, description);
      if (isMatch) {
        article.customCategory.push(name);
        await article.save();
        affectedArticlesCount++;
      } else {
        if (!article.rejectedCategories) {
          article.rejectedCategories = [];
        }
        article.rejectedCategories.push(name);
        await article.save();
      }
      processedArticles++;
    }

    console.log(`Processing complete for category: ${name}`);
    delete processingJobs[name]; // Remove job after completion
  } catch (error) {
    console.error(
      `❌ Error in createCustomCategory for ${req.body.name}:`,
      error
    );
    res.status(500).json({ error: "Error creating custom category" });
  }
};

// Get progress status for a specific category
export const getProgressStatus = async (req: Request, res: Response) => {
  const { name } = req.params;
  if (!processingJobs[name]) {
    res
      .status(404)
      .json({ message: "No active processing for this category." });
    return;
  }
  res.status(200).json({
    category: name,
    progress: processingJobs[name].progressPercentage,
    processing: !processingJobs[name].stopProcessing,
  });
};

// Stop processing for a specific category
export const stopProcessingCategory = async (req: Request, res: Response) => {
  const { name } = req.params;
  if (!processingJobs[name]) {
    res
      .status(404)
      .json({ message: "No active processing for this category." });
    return;
  }
  processingJobs[name].stopProcessing = true;
  res.status(200).json({ message: `Processing for category ${name} stopped.` });
};

// Get all custom categories
export const getAllCustomCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CustomCategory.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// Get articles by custom category
export const getArticlesByCustomCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.params;
    const articles = await Feed.find({ customCategory: name });
    res.status(200).json({
      meta: {
        totalArticles: articles.length,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching articles by category:", error);
    res.status(500).json({ error: "Error fetching articles by category" });
  }
};

// Delete a custom category
export const deleteCustomCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await CustomCategory.findById(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    await Feed.updateMany({}, { $pull: { customCategory: category.name } });
    await CustomCategory.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ error: "Error deleting category" });
  }
};
