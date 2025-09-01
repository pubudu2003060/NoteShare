import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/UserSlice";
import mygroupReducer from "./myGroup/MyGroup";
import groupReducer from "./group/Group";
import NotificationSlice from "./notification/NotificationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    myGroups: mygroupReducer,
    Group: groupReducer,
    Notification: NotificationSlice,
  },
});

export default store;
