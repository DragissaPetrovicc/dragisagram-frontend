import { configureStore } from "@reduxjs/toolkit";
import commentId from "./slices/commentId";
import repPost from "./slices/repPost";
import myId from "./slices/myId";
import bottomNav from "./slices/bottomNav";
import notificationState from "./slices/notificationState";
import allNotifications from "./slices/allNotifications";

const store = configureStore({
  reducer: {
    commentId: commentId,
    repPost: repPost,
    myId: myId,
    bottomNav: bottomNav,
    notificationState: notificationState,
    allNotifications: allNotifications,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
