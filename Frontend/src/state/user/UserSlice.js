import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogedIn: false,
  data: [],
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
  },
});

export const { logedIn, logedOut, addUserData } = user.actions;
export default user.reducer;
