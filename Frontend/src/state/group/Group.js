import { createSlice } from "@reduxjs/toolkit";

const initialSTate = {
  data: {},
  note: [],
};

const Group = createSlice({
  name: "group",
  initialState: initialSTate,
  reducers: {
    setGroupData: (state, action) => {
      state.data = action.payload;
    },
    editGroupData: (state, action) => {
      state.data = { accesslevel: state.data.accesslevel, ...action.payload };
    },
    setNotes: (state, action) => {
      state.note = action.payload;
    },
    addNewNote: (state, action) => {
      state.note = [...state.note, action.payload];
    },
  },
});

export const { setGroupData, editGroupData, setNotes, addNewNote } =
  Group.actions;
export default Group.reducer;
