import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import fileReducer from './fileSlice'; // เพิ่ม fileSlice

export const store = configureStore({
  reducer: {
    user : userReducer,
    files: fileReducer,
  },
})

export default store;