
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: !!localStorage.getItem("adminToken"),
  username: localStorage.getItem("adminUsername") || null,
  token: localStorage.getItem("adminToken") || null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.token = action.payload.token;

      localStorage.setItem("adminToken", action.payload.token);
      localStorage.setItem("adminUsername", action.payload.username);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.token = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUsername");
    },
  },
});

export const { loginSuccess, logout } = adminSlice.actions;
export default adminSlice.reducer;
