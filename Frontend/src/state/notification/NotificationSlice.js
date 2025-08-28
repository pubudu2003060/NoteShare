import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unviewedCount: 0,
  loading: false,
  error: null,
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unviewedCount = action.payload.filter((n) => !n.isViewed).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isViewed) {
        state.unviewedCount += 1;
      }
    },
    markAsViewed: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n._id === notificationId
      );
      if (notification && !notification.isViewed) {
        notification.isViewed = true;
        state.unviewedCount = Math.max(0, state.unviewedCount - 1);
      }
    },
    markAllAsViewed: (state) => {
      state.notifications.forEach((notification) => {
        notification.isViewed = true;
      });
      state.unviewedCount = 0;
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n._id === notificationId
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    updateNotificationAction: (state, action) => {
      const { notificationId, actionType } = action.payload;
      const notification = state.notifications.find(
        (n) => n._id === notificationId
      );
      if (notification) {
        notification.actionTaken = true;
        notification.actionType = actionType;
      }
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n._id === notificationId
      );
      if (notification && !notification.isViewed) {
        state.unviewedCount = Math.max(0, state.unviewedCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n._id !== notificationId
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsViewed,
  markAllAsViewed,
  markAsRead,
  updateNotificationAction,
  removeNotification,
  setLoading,
  setError,
  clearError,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
