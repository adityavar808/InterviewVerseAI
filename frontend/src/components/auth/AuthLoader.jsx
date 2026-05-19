import { useEffect } from "react";

import { useDispatch } from "react-redux";

import {
  setCredentials,
  logout,
  setAuthLoading,
  setAuthInitialized,
} from "../../redux/slices/authSlice";

import api from "../../services/api";

const AuthLoader = () => {

  const dispatch = useDispatch();

  useEffect(() => {

    const loadUser = async () => {

      try {

        dispatch(setAuthLoading(true));

        const token =
          localStorage.getItem(
            "accessToken"
          );

        if (!token) {

          dispatch(logout());

          return;
        }

        const response =
          await api.get(
            "/auth/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        dispatch(
          setCredentials({
            user:
              response.data.user,

            accessToken:
              token,
          })
        );

      } catch (error) {

        localStorage.removeItem(
          "accessToken"
        );

        dispatch(logout());

      } finally {

        dispatch(
          setAuthLoading(false)
        );

        dispatch(
          setAuthInitialized(true)
        );
      }
    };

    loadUser();

  }, [dispatch]);

  return null;
};

export default AuthLoader;