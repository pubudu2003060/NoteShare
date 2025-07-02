import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogedIn: false,
  data: [],
};

const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logedIn: () => {
      state.isLogedIn = true;
    },
    logedOut: () => {
      state.isLogedIn = false;
    },
  },
});

export const { logedIn, logedOut } = user.actions;
export default user.reducer;
