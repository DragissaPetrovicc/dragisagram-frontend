import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "../../config/types";

const initialState: NotificationState = {
  items: [],
};

const allNotifications = createSlice({
  name: "commentId",
  initialState,
  reducers: {
    setAllNotifications: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setAllNotifications } = allNotifications.actions;

export default allNotifications.reducer;
