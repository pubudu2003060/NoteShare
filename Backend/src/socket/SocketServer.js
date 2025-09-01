import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

let io;
const userSockets = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.username} connected:`, socket.id);

    // Store user-socket mapping
    userSockets.set(socket.userId, socket.id);

    // Join user to their own room for personal notifications
    socket.join(`user_${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`User ${socket.user.username} disconnected:`, socket.id);
      userSockets.delete(socket.userId);
    });

    // Handle notification viewed
    socket.on("mark_notification_viewed", (notificationId) => {
      socket
        .to(`user_${socket.userId}`)
        .emit("notification_viewed", notificationId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const getUserSocket = (userId) => {
  return userSockets.get(userId);
};

export const emitToUser = (userId, event, data) => {
  const io = getIO();
  io.to(`user_${userId}`).emit(event, data);
};

export const emitNotificationToUser = (userId, notification) => {
  emitToUser(userId, "new_notification", notification);
};
