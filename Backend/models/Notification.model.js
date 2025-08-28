import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["group_join_request", "group_invitation", "note_shared", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
      groupName: String,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionTaken: {
      type: Boolean,
      default: false,
    },
    actionType: {
      type: String,
      enum: ["approved", "rejected", "none"],
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isViewed: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
