import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    pubDate: { type: Date },
    category: [{ type: String }],
    customCategory: [{ type: String, default: [] }],
    sourceUrl: { type: String, required: true },
    fetchedAt: { type: Date, default: Date.now },
    guid: { type: Object, required: true },
    seoTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    slug: { type: String },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Feed = mongoose.model("Feed", feedSchema);
