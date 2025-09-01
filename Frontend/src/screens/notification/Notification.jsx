import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Check,
  X,
  Trash2,
  User,
  Clock,
  BookMarked,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { JWTAxios } from "../../api/Axios";
import { toast } from "react-toastify";
import {
  setNotifications,
  markAsViewed,
  markAllAsViewed,
  updateNotificationAction,
  removeNotification,
  addNotification,
} from "../../state/notification/NotificationSlice";
import io from "socket.io-client";

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.Notification.notifications
  );
  const unviewedCount = useSelector(
    (state) => state.Notification?.unviewedCount
  );
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchNotifications();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeSocket = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Connected to notification socket");
    });

    newSocket.on("new_notification", (notification) => {
      dispatch(addNotification(notification));
      toast.info(`New notification: ${notification.title}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await JWTAxios.get("/notification");
      if (response.data.success) {
        dispatch(setNotifications(response.data.notifications));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications", {
        position: "top-center",
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsViewed = async (notificationId) => {
    try {
      await JWTAxios.patch(`/notification/${notificationId}/view`);
      dispatch(markAsViewed(notificationId));
    } catch (error) {
      console.error("Error marking notification as viewed:", error);
    }
  };

  const handleMarkAllAsViewed = async () => {
    try {
      await JWTAxios.patch("/notification/mark-all-viewed");
      dispatch(markAllAsViewed());
      toast.success("All notifications marked as viewed", {
        position: "top-center",
        theme: "dark",
      });
    } catch (error) {
      console.error("Error marking all as viewed:", error);
      toast.error("Failed to update notifications", {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  const handleApproveRequest = async (notificationId) => {
    if (processingIds.has(notificationId)) return;

    setProcessingIds((prev) => new Set(prev).add(notificationId));
    try {
      const response = await JWTAxios.post(
        `/notification/${notificationId}/approve`
      );
      if (response.data.success) {
        dispatch(
          updateNotificationAction({
            notificationId,
            actionType: "approved",
          })
        );
        toast.success("User approved and added to group!", {
          position: "top-center",
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(
        error.response?.data?.message || "Failed to approve request",
        {
          position: "top-center",
          theme: "dark",
        }
      );
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (notificationId) => {
    if (processingIds.has(notificationId)) return;

    setProcessingIds((prev) => new Set(prev).add(notificationId));
    try {
      const response = await JWTAxios.post(
        `/notification/${notificationId}/reject`
      );
      if (response.data.success) {
        dispatch(
          updateNotificationAction({
            notificationId,
            actionType: "rejected",
          })
        );
        toast.success("Request rejected", {
          position: "top-center",
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request", {
        position: "top-center",
        theme: "dark",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await JWTAxios.delete(`/notification/${notificationId}`);
      dispatch(removeNotification(notificationId));
      toast.success("Notification deleted", {
        position: "top-center",
        theme: "dark",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification", {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type, actionType) => {
    if (actionType === "approved")
      return <UserCheck className="w-5 h-5 text-green-600" />;
    if (actionType === "rejected")
      return <UserX className="w-5 h-5 text-red-600" />;

    switch (type) {
      case "group_join_request":
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unviewedCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unviewedCount}
                </span>
              )}
            </div>
            {unviewedCount > 0 && (
              <button
                onClick={handleMarkAllAsViewed}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <BookMarked className="w-4 h-4" />
                Mark All as Viewed
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500 dark:text-slate-400">
                You'll see notifications here when you receive them
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-all duration-200 hover:shadow-md ${
                  !notification.isViewed ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(
                      notification.type,
                      notification.actionType
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-slate-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {notification.sender?.username || "System"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(notification.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.isViewed && (
                          <button
                            onClick={() => handleMarkAsViewed(notification._id)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                            title="Mark as viewed"
                          >
                            <Check className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification._id)
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-red-500"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action buttons for group join requests */}
                    {notification.type === "group_join_request" &&
                      !notification.actionTaken && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                          <button
                            onClick={() =>
                              handleApproveRequest(notification._id)
                            }
                            disabled={processingIds.has(notification._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processingIds.has(notification._id) ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleRejectRequest(notification._id)
                            }
                            disabled={processingIds.has(notification._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {processingIds.has(notification._id) ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                            Reject
                          </button>
                        </div>
                      )}

                    {/* Status indicator for processed requests */}
                    {notification.type === "group_join_request" &&
                      notification.actionTaken && (
                        <div
                          className={`mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center gap-2 text-sm ${
                            notification.actionType === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {notification.actionType === "approved" ? (
                            <UserCheck className="w-4 h-4" />
                          ) : (
                            <UserX className="w-4 h-4" />
                          )}
                          Request {notification.actionType}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
