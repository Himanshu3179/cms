import { Request, Response } from "express";
import { Feed } from "../models/Feed";
import { AiArticles } from "../models/AiArticles";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { buildAiPrompt } from "../utils/buildAiPrompt"; // reuse your prompt builder
import { AVAILABLE_MODELS, getModelByAuthor } from "../models/chatModels";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/ai-articles/generate-multiple
 * Body expects:
 * {
 *   modelAuthor: string,
 *   filters: { category?: string[], sourceUrl?: string, pubDate?: string, search?: string },
 *   numberOfArticles: number,
 *   userInstructions: string
 * }
 */
export const generateMultipleAiArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { modelAuthor, filters, numberOfArticles, userInstructions } = req.body;

  if (!modelAuthor || !numberOfArticles || !filters) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  // ✅ Get full model ID from author name
  const model = getModelByAuthor(modelAuthor);
  if (!model) {
    res.status(400).json({ message: `Invalid model author: ${modelAuthor}` });
    return;
  }

  try {
    // Build a query based on the provided filters
    const query: any = {};
    if (filters.category && filters.category.length > 0) {
      query.category = { $in: filters.category };
    }
    if (filters.sourceUrl) {
      query.sourceUrl = filters.sourceUrl;
    }
    if (filters.pubDate) {
      query.pubDate = filters.pubDate;
    }
    if (filters.search) {
      query.title = { $regex: filters.search, $options: "i" };
    }

    // Find matching feeds (limit by numberOfArticles)
    const feeds = await Feed.find(query).limit(numberOfArticles);

    const generatedArticles = [];

    for (const feed of feeds) {
      // Skip if already processed
      const existingArticle = await AiArticles.findOne({
        originalFeed: feed._id,
      });
      if (existingArticle) {
        generatedArticles.push(existingArticle);
        continue;
      }

      // Build the prompt using feed details and user instructions
      const prompt = buildAiPrompt(
        feed.title,
        feed.description,
        userInstructions
      );

      // Request AI generation
      const aiResponse = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: "You are an expert journalist AI." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1,
      });

      let responseText = aiResponse.choices[0]?.message?.content || "{}";

      // Clean up the response text
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (error) {
        console.error("JSON parsing error for feed", feed._id, error);
        continue;
      }

      // Create new AI article document
      const newAiArticle = new AiArticles({
        originalFeed: feed._id,
        title: parsedData.title || feed.title,
        processedContent: parsedData.description || feed.description,
        seo: {
          metaTitle: parsedData.seo?.meta_title || "",
          metaDescription: parsedData.seo?.meta_description || "",
          keywords: parsedData.seo?.keywords || [],
        },
        status: "processed",
        processedAt: new Date(),
      });
      await newAiArticle.save();
      generatedArticles.push(newAiArticle);
    }

    res.status(200).json({ generatedArticles });
  } catch (error: any) {
    console.error("Error generating multiple AI articles", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
