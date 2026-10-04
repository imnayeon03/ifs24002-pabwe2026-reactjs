// src/features/users/states/reducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  user: null,
  isLoading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export default usersSlice.reducer;