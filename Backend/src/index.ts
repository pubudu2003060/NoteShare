import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const dbUri = process.env.DB_URI;
if (!dbUri) {
  throw new Error("DB_URI environment variable is not defined");
}
await mongoose.connect(dbUri).then(() => {
  console.log("✅ Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Hello TypeScript + ESM + Express!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
