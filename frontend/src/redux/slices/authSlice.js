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

    updateUserCredits: (state, action) => {
      if (state.user) {
        if (action.payload.interviewCredits !== undefined) {
          state.user.interviewCredits = action.payload.interviewCredits;
        }
        if (action.payload.resumeCredits !== undefined) {
          state.user.resumeCredits = action.payload.resumeCredits;
        }
        if (!action.payload.skipBroadcast && typeof window !== "undefined") {
          try {
            if ("BroadcastChannel" in window) {
              const channel = new BroadcastChannel("interviewverse_credits_sync");
              channel.postMessage({
                interviewCredits: state.user.interviewCredits,
                resumeCredits: state.user.resumeCredits,
              });
              channel.close();
            }
          } catch (e) {}
          try {
            localStorage.setItem(
              "user_credits_sync",
              JSON.stringify({
                interviewCredits: state.user.interviewCredits,
                resumeCredits: state.user.resumeCredits,
                ts: Date.now(),
              })
            );
          } catch (e) {}
        }
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setAuthLoading,
  setAuthInitialized,
  updateUserCredits,
} = authSlice.actions;

export default authSlice.reducer;