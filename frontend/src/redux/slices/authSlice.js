import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,

  accessToken: localStorage.getItem("accessToken") || null,

  isAuthenticated: !!localStorage.getItem("accessToken"),

  isAuthLoading: true,

  authInitialized: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;

      state.accessToken =
        action.payload.accessToken;

      state.isAuthenticated = true;

      localStorage.setItem("accessToken", action.payload.accessToken);
    },

    logout: (state) => {
      state.user = null;

      state.accessToken = null;

      state.isAuthenticated = false;

      state.authInitialized = true;

      state.isAuthLoading = false;

      localStorage.removeItem("accessToken");
    },

    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
    },

    setAuthInitialized: (state, action) => {
      state.authInitialized = action.payload;
    },
  },
});

export const {
  setCredentials,
  logout,
  setAuthLoading,
  setAuthInitialized,
} = authSlice.actions;

export default authSlice.reducer;