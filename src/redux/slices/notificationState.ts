import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationState } from "../../config/types";

const initialState: NotificationState = {
  items: [],
};

const notificationsNumber = createSlice({
  name: "commentId",
  initialState,
  reducers: {
    setNotificationsNumber: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setNotificationsNumber } = notificationsNumber.actions;

export default notificationsNumber.reducer;
