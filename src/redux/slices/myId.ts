import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const myId = createSlice({
  name: "myId",
  initialState: {
    items: "",
  },
  reducers: {
    setMyId: (state, action: PayloadAction<string>) => {
      state.items = action.payload;
    },
  },
});

export const { setMyId } = myId.actions;

export default myId.reducer;
