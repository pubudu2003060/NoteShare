import { createSlice } from "@reduxjs/toolkit";

const initialSTate = {
  data: [],
  note: [],
  members: [],
  editors: [],
};

const Group = createSlice({
  name: "group",
  initialState: initialSTate,
  reducers: {},
});

export const {} = Group.actions;
export default Group.reducer;
