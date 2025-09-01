import express from "express";
import {
  getUserNotifications,
  markNotificationAsViewed,
  markAllNotificationsAsViewed,
  approveGroupJoinRequest,
  rejectGroupJoinRequest,
  deleteNotification,
} from "../controllers/Notification.controler.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";

const notificationRouter = express.Router();

// Get user notifications
notificationRouter.get("/", verifyAccessToken, getUserNotifications);

// Mark single notification as viewed
notificationRouter.patch(
  "/:notificationId/view",
  verifyAccessToken,
  markNotificationAsViewed
);

// Mark all notifications as viewed
notificationRouter.patch(
  "/mark-all-viewed",
  verifyAccessToken,
  markAllNotificationsAsViewed
);

// Approve group join request
notificationRouter.post(
  "/:notificationId/approve",
  verifyAccessToken,
  approveGroupJoinRequest
);

// Reject group join request
notificationRouter.post(
  "/:notificationId/reject",
  verifyAccessToken,
  rejectGroupJoinRequest
);

// Delete notification
notificationRouter.delete(
  "/:notificationId",
  verifyAccessToken,
  deleteNotification
);

export default notificationRouter;
