import { OpenAI } from "openai";
import { CustomRequest } from "../../types/express";
import { Response } from "express";
import dotenv from "dotenv";
import { Feed } from "../models/Feed";
import { AVAILABLE_MODELS, getModelByAuthor } from "../models/chatModels";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handleChatRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { modelAuthor, selectedArticleIds, userInstructions } = req.body;

    // ✅ Validate Inputs
    if (!modelAuthor) {
      res.status(400).json({ message: "Model author name is required." });
      return;
    }

    // ✅ Get full model ID from author name
    const model = getModelByAuthor(modelAuthor);
    if (!model) {
      res.status(400).json({ message: `Invalid model author: ${modelAuthor}` });
      return;
    }

    if (
      !selectedArticleIds ||
      !Array.isArray(selectedArticleIds) ||
      selectedArticleIds.length === 0
    ) {
      res
        .status(400)
        .json({ message: "At least one article must be provided." });
      return;
    }

    // ✅ Fetch Articles Using getFeedById
    const fetchedArticles = await Promise.all(
      selectedArticleIds.map(async (articleId) => {
        try {
          const feed = await Feed.findById(articleId);
          if (feed) return feed; // Return only if the article exists
        } catch (error) {
          console.warn(
            `Warning: Article with ID ${articleId} not found or invalid.`
          );
          return null; // Ignore invalid articles
        }
      })
    );

    // ✅ Filter out invalid articles
    const validArticles = fetchedArticles.filter((article) => article !== null);
    if (validArticles.length === 0) {
      res
        .status(404)
        .json({ message: "No valid articles found for the provided IDs." });
      return;
    }

    // ✅ Format Articles into Context
    const articleContext = validArticles
      .map((a: any) => `Title: ${a.title}\nContent: ${a.description}`)
      .join("\n\n");

    // ✅ Construct AI Prompt
    const prompt = `
      You are an AI journalist assistant. Based on the following articles:
      ${articleContext}

      Write a new article according to the user’s instructions: "${userInstructions}". 
      The article should include:
      - A **title** that is catchy and relevant.
      - A **short description** summarizing the article.
      - A **detailed content body**.

      All 3 in seperate lines.
      Ensure the output follows the selected model’s writing style.
    `;

    // ✅ OpenAI API Call
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are an expert journalist AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // ✅ Token Usage Logging
    const tokenUsage = response.usage?.total_tokens;
    console.log(`Token usage: ${tokenUsage}`);

    // ✅ Send Response
    res.json({
      generatedArticle: response.choices[0]?.message?.content || "No response",
      tokenUsage,
    });
  } catch (error: any) {
    console.error("❌ Error in handleChatRequest:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

export const getAvailableModelAuthors = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const authors = AVAILABLE_MODELS.map((model) => model.author);
    res.json({ models: authors });
  } catch (error: any) {
    console.error("❌ Error fetching model authors:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch available model authors." });
  }
};
