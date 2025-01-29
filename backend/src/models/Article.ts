import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: [{ type: String }],
    sourceUrl: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model("Article", articleSchema);
