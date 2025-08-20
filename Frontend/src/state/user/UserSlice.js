import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogedIn: false,
  data: null,
};

const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logedIn: (state) => {
      state.isLogedIn = true;
    },
    logedOut: (state) => {
      state.isLogedIn = false;
    },
    addUserData: (state, action) => {
      state.data = action.payload;
    },
    updateUserData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { logedIn, logedOut, addUserData, updateUserData } = user.actions;
export default user.reducer;
