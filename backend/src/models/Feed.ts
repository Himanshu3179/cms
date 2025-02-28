import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    pubDate: { type: Date },
    category: [{ type: String }],
    customCategory: [{ type: String, default: [] }],
    rejectedCategories: [{ type: String, default: [] }],
    sourceUrl: { type: String },
    fetchedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Feed = mongoose.model("Feed", feedSchema);