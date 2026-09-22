import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  logout,
  setAuthLoading,
  setAuthInitialized,
  updateUserCredits,
} from "../../redux/slices/authSlice";
import api from "../../services/api";

const AuthLoader = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  // Initial user load
  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch(setAuthLoading(true));

        if (!accessToken) {
          dispatch(logout());
          return;
        }

        const response = await api.get("/auth/me");
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: accessToken,
          })
        );
      } catch (error) {
        localStorage.removeItem("accessToken");
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
        dispatch(setAuthInitialized(true));
      }
    };

    loadUser();
  }, [dispatch, accessToken]);

  // Real-time credit listeners across tabs and window focus
  useEffect(() => {
    if (!accessToken) return;

    // 1. BroadcastChannel listener
    let channel = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("interviewverse_credits_sync");
        channel.onmessage = (event) => {
          if (event.data) {
            dispatch(
              updateUserCredits({
                interviewCredits: event.data.interviewCredits,
                resumeCredits: event.data.resumeCredits,
                skipBroadcast: true,
              })
            );
          }
        };
      } catch (e) {}
    }

    // 2. Storage event listener fallback for older browsers
    const handleStorageChange = (e) => {
      if (e.key === "user_credits_sync" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          dispatch(
            updateUserCredits({
              interviewCredits: data.interviewCredits,
              resumeCredits: data.resumeCredits,
              skipBroadcast: true,
            })
          );
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 3. Silent background refresh on tab focus to sync server state
    const handleFocus = async () => {
      try {
        const response = await api.get("/auth/me");
        const freshUser = response.data?.user;
        if (freshUser) {
          dispatch(
            updateUserCredits({
              interviewCredits: freshUser.interviewCredits,
              resumeCredits: freshUser.resumeCredits,
              skipBroadcast: true,
            })
          );
        }
      } catch (e) {}
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, accessToken]);

  return null;
};

export default AuthLoader;