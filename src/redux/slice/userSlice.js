// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isLoggedIn: !!localStorage.getItem("token"),
//   user: localStorage.getItem("username") || null,
//   token: localStorage.getItem("token") || null,
// };

// const userSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.isLoggedIn = true;
//       state.user = action.payload.username;
//       state.token = action.payload.token;

//       localStorage.setItem("token", action.payload.token);
//       localStorage.setItem("username", action.payload.username);
//     },
//     logout: (state) => {
//       state.isLoggedIn = false;
//       state.user = null;
//       state.token = null;
//       localStorage.clear();
//     },
//   },
// });

// export const { loginSuccess, logout } = userSlice.actions;
// export default userSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  username: localStorage.getItem("username") || null,
  profilePic: localStorage.getItem("profilePic") || null,
  email: localStorage.getItem("email") || null,
  token: localStorage.getItem("token") || null,
};


const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
        state.isLoggedIn = true;
        state.username = action.payload.username;
        state.profilePic = action.payload.profilePic;
        state.email = action.payload.email;
        state.token = action.payload.token;


        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("profilePic", action.payload.profilePic);
    },
    logout: (state) => {
        state.isLoggedIn = false;
        state.username = null;
        state.token = null;
        state.profilePic = null;

        localStorage.clear();
    }
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

