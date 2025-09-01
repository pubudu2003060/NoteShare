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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "throwaway-passport-bridge",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "false",
      sameSite: "lax",
    },
  })
);

app.use(cookieParser());

const io = initializeSocket(server);

app.set("io", io);

app.use("/api/user", userRouter);

app.use("/api/note", noteRouter);

app.use("/api/group", groupRouter);

app.use("/api/auth", auth);

app.use("/api/notification", notificationRouter);

app.use("/api/other", other);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await connectDb();
  console.log("Server is running on http://localhost:" + PORT);
});
