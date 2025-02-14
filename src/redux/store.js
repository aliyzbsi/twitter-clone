import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/authSlice.js";
import tweetReducer from "./Slices/tweetSlice.js";
import followReducer from "./Slices/followSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweet: tweetReducer,
    follow: followReducer,
  },
});
