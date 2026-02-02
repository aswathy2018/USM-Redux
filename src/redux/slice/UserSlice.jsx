import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

const UserSlice = createSlice({
    name: "auth",
    initialState: {
        user: localStorage.getItem("username"),
        token: localStorage.getItem("token"),
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.username;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.clear();
        },
    },
})

export const { loginSuccess, logout } = UserSlice.actions;
export default UserSlice.reducer;