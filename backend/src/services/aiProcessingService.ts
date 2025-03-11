import { Feed } from "../models/Feed";
import { AiArticles } from "../models/AiArticles";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Process pending feeds by generating an AI article for each feed that hasn't been processed yet.
 */
export const processPendingFeeds = async (): Promise<void> => {
  try {
    // 1. Get list of feed IDs that already have an associated AiArticles record.
    const processedFeedIds = await AiArticles.find().distinct("originalFeed");

    // 2. Find all feeds that do NOT have a corresponding AiArticles document.
    const pendingFeeds = await Feed.find({
      _id: { $nin: processedFeedIds },
    });

    console.log(`Found ${pendingFeeds.length} pending feed(s) to process.`);

    // 3. Loop over each pending feed and process it.
    for (const feed of pendingFeeds) {
      try {
        // Create a prompt based on the feed content.
        // You can adjust the prompt template as needed.
        const prompt = `
          You are an expert AI journalist assistant skilled in crafting highly engaging, well-structured, and SEO-optimized articles.
          Rewrite the following article with a professional tone, engaging narrative, and proper SEO practices:
          
          Title: ${feed.title}
          Content: ${feed.description}
          
          Ensure the article includes a compelling title, formatted content in Markdown, and SEO metadata (meta title, meta description, and relevant keywords).
          
          Respond with a valid JSON object in the following format:
          {
            "title": "[Generated Title with Keywords]",
            "description": "[Generated Content in Markdown]",
            "seo": {
              "meta_title": "[SEO Optimized Title]",
              "meta_description": "[Compelling Meta Description]",
              "keywords": ["keyword1", "keyword2", "keyword3"]
            }
          }
        `;

        // Call OpenAI Chat Completion API.
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // or use your preferred model from your configuration
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

        // Clean and parse the response.
        let responseText = response.choices[0]?.message?.content || "{}";
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "");

        let parsedData;
        try {
          parsedData = JSON.parse(responseText);
        } catch (jsonError) {
          console.error("JSON parsing error for feed:", feed._id, jsonError);
          // Optionally, you can record this error in a log or update a feed status.
          continue;
        }

        // Create a new AiArticles document.
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
        console.log(`Processed feed ${feed._id} successfully.`);
      } catch (err) {
        console.error(`Error processing feed ${feed._id}:`, err);
        // Optionally, update the feed or log error details into AiArticles for retry/analysis.
        // For example, you might create an AiArticles document with status "failed" or update the Feed document.
      }
    }
  } catch (error) {
    console.error("Error in processPendingFeeds:", error);
  }
};
