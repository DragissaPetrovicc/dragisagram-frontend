import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  items: "",
};

const repPost = createSlice({
  name: "repPost",
  initialState,
  reducers: {
    setPostId: (state, action: PayloadAction<string>) => {
      state.items = action.payload;
    },
    removePostId: (state) => {
      state.items = initialState.items;
    },
  },
});

export const { setPostId, removePostId } = repPost.actions;

export default repPost.reducer;
