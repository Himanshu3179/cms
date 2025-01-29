import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/rssFeeds";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
