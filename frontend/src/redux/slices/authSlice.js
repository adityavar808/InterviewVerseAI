import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,

  accessToken: null,

  isAuthenticated: false,

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
    },

    logout: (state) => {
      state.user = null;

      state.accessToken = null;

      state.isAuthenticated = false;

      state.authInitialized = true;

      state.isAuthLoading = false;
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