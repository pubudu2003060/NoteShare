// controllers/Notification.controller.js
import Notification from "../models/Notification.model.js";
import Group from "../models/Group.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";
import { emitNotificationToUser } from "../socket/SocketServer.js";

// Create notification helper function
export const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();

    // Populate sender and data fields for real-time emission
    await notification.populate("sender", "username email");

    // Emit to recipient via socket
    emitNotificationToUser(data.recipient.toString(), notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username email")
      .populate("data.groupId", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const unviewedCount = await Notification.countDocuments({
      recipient: userId,
      isViewed: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unviewedCount,
      totalPages: Math.ceil(
        (await Notification.countDocuments({ recipient: userId })) / limit
      ),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
};

// Mark notification as viewed
export const markNotificationAsViewed = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isViewed: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as viewed",
    });
  } catch (error) {
    console.error("Error marking notification as viewed:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
    });
  }
};

// Mark all notifications as viewed
export const markAllNotificationsAsViewed = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isViewed: false },
      { isViewed: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as viewed",
    });
  } catch (error) {
    console.error("Error marking all notifications as viewed:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
    });
  }
};

// Handle group join request approval
export const approveGroupJoinRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const adminId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the notification
      const notification = await Notification.findById(notificationId).session(
        session
      );

      if (!notification || notification.type !== "group_join_request") {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: "Invalid notification",
        });
      }

      // Check if admin is the recipient
      if (!notification.recipient.equals(adminId)) {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          message: "Unauthorized action",
        });
      }

      // Check if already processed
      if (notification.actionTaken) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Request already processed",
        });
      }

      const groupId = notification.data.groupId;
      const requesterId = notification.sender;

      // Add user to group
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: requesterId } },
        { session, new: true }
      ).populate("members editors", "username email");

      // Update notification
      await Notification.findByIdAndUpdate(
        notificationId,
        {
          actionTaken: true,
          actionType: "approved",
          isViewed: true,
          isRead: true,
        },
        { session }
      );

      // Create approval notification for requester
      await createNotification({
        recipient: requesterId,
        sender: adminId,
        type: "other",
        title: "Group Join Request Approved",
        message: `Your request to join "${notification.data.groupName}" has been approved!`,
        data: {
          groupId: groupId,
          groupName: notification.data.groupName,
        },
      });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "User added to group successfully",
        updatedGroupMembers: {
          members: updatedGroup.members,
          editors: updatedGroup.editors,
        },
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error approving group join request:", error);
    res.status(500).json({
      success: false,
      message: "Error processing request",
    });
  }
};

// Handle group join request rejection
export const rejectGroupJoinRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const adminId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification || notification.type !== "group_join_request") {
      return res.status(404).json({
        success: false,
        message: "Invalid notification",
      });
    }

    if (!notification.recipient.equals(adminId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    if (notification.actionTaken) {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    // Update notification
    await Notification.findByIdAndUpdate(notificationId, {
      actionTaken: true,
      actionType: "rejected",
      isViewed: true,
      isRead: true,
    });

    // Create rejection notification for requester
    await createNotification({
      recipient: notification.sender,
      sender: adminId,
      type: "other",
      title: "Group Join Request Rejected",
      message: `Your request to join "${notification.data.groupName}" has been rejected.`,
      data: {
        groupId: notification.data.groupId,
        groupName: notification.data.groupName,
      },
    });

    res.status(200).json({
      success: true,
      message: "Request rejected",
    });
  } catch (error) {
    console.error("Error rejecting group join request:", error);
    res.status(500).json({
      success: false,
      message: "Error processing request",
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
    });
  }
};
