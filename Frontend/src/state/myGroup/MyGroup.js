import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const MyGRoup = createSlice({
  name: "mygroup",
  initialState: initialState,
  reducers: {
    loadMyGroupData: (state, action) => {
      state.data = action.payload;
    },
    addNewMyGroup: (state, action) => {
      state.data = [action.payload, ...state.data];
    },
  },
});

export const { loadMyGroupData, addNewMyGroup } = MyGRoup.actions;
export default MyGRoup.reducer;
