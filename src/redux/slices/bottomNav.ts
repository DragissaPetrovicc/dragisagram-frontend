import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  items: 0,
};

const bottomNav = createSlice({
  name: "bottomNav",
  initialState,
  reducers: {
    setBottomNavValue: (state, action: PayloadAction<number>) => {
      state.items = action.payload;
    },
    removeBottomNavValue: (state) => {
      state.items = initialState.items;
    },
  },
});

export const { setBottomNavValue, removeBottomNavValue } = bottomNav.actions;

export default bottomNav.reducer;
