import { Request, Response } from "express";
import { Feed } from "../models/Feed";
import OpenAI from "openai";

// 1) Create and configure your OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // ensure your API key is set
});

export const aiQueryFeeds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the user's free-form text describing what they want
    const { userQuery } = req.body;

    // Default pagination values
    const pageNum = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const skip = (pageNum - 1) * pageSize;

    let mongoQuery: object;
    let aiQuery: string;
    let aiReply: string;

    // If no userQuery is provided, return default query (no filter)
    if (!userQuery) {
      mongoQuery = {};
      aiQuery = "No filters applied.";
      aiReply = "Default query: {}";
    } else {
      // 2) Define the system prompt and the user prompt for AI processing
      const systemPrompt = `
        You are an assistant that converts a natural language user request into a valid MongoDB query (as a JSON object) and also provides an AI-generated summary of the query.
        The target collection has fields: title, description, category (array of strings), pubDate (Date), content (string), etc.
        
        Constraints / format rules:
        - Output valid JSON only, with a single top-level object. No extra text.
        - The output JSON must follow this schema:
              {
                "mongoQuery": { ... valid MongoDB query object ... },
                "aiQuery": "A refined description of the query in plain language."
              }
        - If the user does not specify a particular field, do not include it.
        - Use safe MongoDB operators only (e.g. $and, $or, $gte, $lte, $regex, etc.).
        - Use case-insensitive regex for text searches.
        - If the request is ambiguous or unanswerable, return an empty query: {}.
      `;

      const userPrompt = `User's request: "${userQuery}"`;

      // 3) Define the JSON Schema for Structured Outputs
      const jsonSchema = {
        name: "ai_mongo_query",
        schema: {
          type: "object",
          properties: {
            mongoQuery: {
              type: "object",
              description:
                "A valid MongoDB query object generated from the user's request.",
            },
            aiQuery: {
              type: "string",
              description:
                "A refined, AI-generated summary of the query in plain language.",
            },
          },
          required: ["mongoQuery", "aiQuery"],
          additionalProperties: false,
        },
        strict: true,
      };

      // 4) Call the OpenAI Chat API using Structured Outputs
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // adjust the model as needed
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        response_format: { type: "json_schema", json_schema: jsonSchema },
      });

      // 5) Extract and parse the assistant’s reply
      const aiOutputRaw = completion.choices[0]?.message?.content?.trim();
      if (!aiOutputRaw) {
        res.status(500).json({
          message: "No AI response received. Check your OpenAI configuration.",
        });
        return;
      }
      aiReply = aiOutputRaw;
      let parsedOutput;
      try {
        parsedOutput = JSON.parse(aiOutputRaw);
      } catch (err) {
        res.status(500).json({
          message: "Failed to parse AI response into JSON.",
          aiReply: aiOutputRaw,
        });
        return;
      }
      if (typeof parsedOutput !== "object") {
        res.status(400).json({
          message: "AI returned an invalid query structure.",
          aiReply: aiOutputRaw,
        });
        return;
      }
      mongoQuery = parsedOutput.mongoQuery;
      aiQuery = parsedOutput.aiQuery;
    }

    // 6) Execute the MongoDB query (limit to pageSize results)
    const totalFeeds = await Feed.countDocuments(mongoQuery);
    const results = await Feed.find(mongoQuery).skip(skip).limit(pageSize);

    // 7) Return the final structured output in JSON format
    res.json({
      userQuery: userQuery || "",
      aiReply,
      mongoQuery,
      aiQuery,
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalFeeds / pageSize),
        totalFeeds,
        limit: pageSize,
      },
      results,
    });
  } catch (error: any) {
    console.error("AI Query Error:", error);
    res.status(500).json({ message: "Failed to process AI query." });
  }
};
