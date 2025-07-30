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
    deleteMyGroup: (state, action) => {
      state.data = state.data.filter((group) => group.id != action.payload);
    },
  },
});

export const { loadMyGroupData, addNewMyGroup, deleteMyGroup } =
  MyGRoup.actions;
export default MyGRoup.reducer;
