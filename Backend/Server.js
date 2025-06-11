import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/DBConnection.js";
import userRouter from "./routes/User.routes.js";
import cors from "cors";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDb();
  console.log("Server is running on http://localhost:" + PORT);
});
