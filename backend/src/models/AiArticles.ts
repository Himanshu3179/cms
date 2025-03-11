import mongoose from "mongoose";

const aiArticleSchema = new mongoose.Schema(
  {
    // Reference to the original Feed article
    originalFeed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    // The SEO-optimized title generated by AI
    title: {
      type: String,
      required: true,
    },
    // The refined, SEO-optimized content in Markdown or HTML
    processedContent: {
      type: String,
      required: true,
    },
    // SEO metadata for the article
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
    // Track the processing status of the article
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    // Timestamp when processing was completed
    processedAt: {
      type: Date,
      default: Date.now,
    },
    // Optional field for any error messages during processing
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AiArticles = mongoose.model("AiArticles", aiArticleSchema);
