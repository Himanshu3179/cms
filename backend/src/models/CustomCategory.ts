import mongoose from "mongoose";

const CustomCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

export const CustomCategory = mongoose.model(
  "CustomCategory",
  CustomCategorySchema
);