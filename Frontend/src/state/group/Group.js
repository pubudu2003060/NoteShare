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
    addMembers: (state, action) => {
      state.data = {
        ...state.data,
        editors: action.payload.editors,
        members: action.payload.members,
      };
    },
  },
});

export const { setGroupData, editGroupData, setNotes, addNewNote, addMembers } =
  Group.actions;
export default Group.reducer;
