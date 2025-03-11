import mongoose, { Document, Schema } from "mongoose";

export interface IKeyword extends Document {
  value: string;
}

const keywordSchema: Schema = new Schema(
  {
    value: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Keyword = mongoose.model<IKeyword>("Keyword", keywordSchema);
