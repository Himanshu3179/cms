import app from "./app";
import { connectToDatabase } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log(`[${new Date().toISOString()}] Connected to MongoDB.`);

    app.listen(PORT, () => {
      console.log(
        `[${new Date().toISOString()}] Server running on port ${PORT}`
      );
    });
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Error starting server:`,
      error.message
    );
    process.exit(1);
  }
};

startServer();
