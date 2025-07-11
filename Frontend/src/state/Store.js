import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/UserSlice";
import mygroupReducer from "./myGroup/MyGroup";

const store = configureStore({
  reducer: {
    user: userReducer,
    myGroups: mygroupReducer,
  },
});

export default store;
