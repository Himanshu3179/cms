import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use("/", (req, res) => {
//   res.send("RSS Reader API");
// });

app.use("/api", routes);

export default app;
