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
      You are an expert AI journalist assistant skilled in crafting highly engaging, well-structured, and SEO-optimized news articles. Your task is to rewrite the given article in an engaging, informative, and professional manner, ensuring it aligns with modern journalism standards.

      ### **Provided Article:**
      ${articleContext}

      ### **User Instructions:**
      "${userInstructions}"

      ### **Writing Style & Engagement Guidelines:**
      - **Tone & Style:** Professional, engaging, and journalistic.
      - **Clarity & Readability:** Maintain short, impactful sentences for easy reading.
      - **Emphasize Key Points:** Use **bold** text for important information and *italics* for notable terms.
      - **Logical Flow:** Ensure smooth transitions between paragraphs.
      - **Hook & CTA:** Start with a compelling hook and end with a call to action or key takeaway.

      ### **SEO Optimization Guidelines:**
      - **Primary Keywords:** Extract key phrases from the article and integrate them naturally.
      - **Meta Description:** Generate a compelling meta description (120-160 characters).
      - **SEO Tags:** Provide relevant **SEO-friendly title, meta description, and keyword tags**.
      - **Internal & External Links:** Ensure proper link placement for enhanced SEO value.
      - **Headings:** Use proper **H1, H2, H3** tags for better readability and SEO.

      ### **Formatting Guidelines:**
      - **Title:** Catchy, keyword-rich, and engaging.
      - **Description:** Well-formatted Markdown content with:
        - Bullet points for structured information.
        - Proper paragraph spacing for readability.
        - SEO-optimized keyword usage.

      ### **Expected Output Format (Must be a Valid JSON Object):**
      \`\`\`json
      {
        "title": "[Generated Title with Keywords]",
        "description": "[Generated Content in Markdown]",
        "seo": {
          "meta_title": "[SEO Optimized Title]",
          "meta_description": "[Compelling Meta Description]",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }
      }
      \`\`\`

      ### **Important Rules:**
      - The response **must be in valid JSON format**.
      - Ensure the **description** is fully formatted in Markdown.
      - Do **not** include any extra text outside the JSON output.
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

    let responseText = response.choices[0]?.message?.content || "{}";

    // ✅ Remove backticks from the response text
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "");

    try {
      const parsedData = JSON.parse(responseText);
      const title = parsedData.title || "Untitled";
      const description = parsedData.description || "No description available.";

      res.status(200).json({ title, description });
    } catch (error) {
      console.error("❌ Error parsing JSON response:", error);
      res.status(500).json({ message: "Error parsing JSON response from AI." });
    }
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
