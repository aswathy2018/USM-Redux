import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slice/userSlice"

export const Store = configureStore({
    reducer: {
        auth: userReducer,
    },
})
