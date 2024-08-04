import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const commentId = createSlice({
  name: "commentId",
  initialState: {
    items: "",
  },
  reducers: {
    setCommentId: (state, action: PayloadAction<string>) => {
      state.items = action.payload;
    },
  },
});

export const { setCommentId } = commentId.actions;

export default commentId.reducer;
