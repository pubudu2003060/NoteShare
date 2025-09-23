import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/DBConnection.js";
import userRouter from "./routes/User.routes.js";
import cors from "cors";
import noteRouter from "./routes/Note.routes.js";
import groupRouter from "./routes/Group.routes.js";
import auth from "./routes/Auth.routes.js";
import other from "./routes/Other.routes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import { initializeSocket } from "./socket/SocketServer.js";
import notificationRouter from "./routes/Notification.route.js";

const app = express();
const server = createServer(app);

dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://note-share-frontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.SESSION_SECURE,
      sameSite: "lax",
    },
  })
);

app.use(cookieParser());

const io = initializeSocket(server);

app.set("io", io);

app.get("/", (req, res) => {
  res.send("Api work");
});

app.use("/api/user", userRouter);

app.use("/api/note", noteRouter);

app.use("/api/group", groupRouter);

app.use("/api/auth", auth);

app.use("/api/notification", notificationRouter);

app.use("/api/other", other);

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to start server due to DB connection error:", error);
    process.exit(1);
  });
