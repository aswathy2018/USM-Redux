import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import adminReducer from "./slice/adminSlice";

export const Store = configureStore({
  reducer: {
    auth: userReducer,
    admin: adminReducer,
  },
});
