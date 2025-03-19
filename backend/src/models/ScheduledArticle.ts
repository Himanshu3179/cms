import mongoose from "mongoose";

const schedulingRulesSchema = new mongoose.Schema(
  {
    dailyPostLimit: { type: Number, required: true },
    weeklyPostRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    postingWindow: {
      start: { type: String, required: true }, // e.g. "09:00"
      end: { type: String, required: true }, // e.g. "21:00"
    },
    randomizeTimes: { type: Boolean, default: true },
  },
  { _id: false }
);

const scheduledArticleSchema = new mongoose.Schema(
  {
    feedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    postingPlatform: { type: String, required: true },
    caption: { type: String },
    hashtags: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "scheduled", "published", "failed"],
      default: "pending",
    },
    schedulingRules: { type: schedulingRulesSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const ScheduledArticle = mongoose.model(
  "ScheduledArticle",
  scheduledArticleSchema
);
