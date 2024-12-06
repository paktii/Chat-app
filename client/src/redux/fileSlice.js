// src/redux/fileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedFiles: [],
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    uploadFile: (state, action) => {
      state.uploadedFiles.push(action.payload); // เก็บไฟล์ที่อัปโหลด
    },
  },
});

export const { uploadFile } = fileSlice.actions;
export default fileSlice.reducer;
