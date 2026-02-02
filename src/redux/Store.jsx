import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slice/UserSlice"

export const Store = configureStore({
    reducer: {
        auth: userReducer,
    },
})
