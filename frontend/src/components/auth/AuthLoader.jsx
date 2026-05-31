import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  setCredentials,
  logout,
  setAuthLoading,
  setAuthInitialized,
} from "../../redux/slices/authSlice";

import api from "../../services/api";

const AuthLoader = () => {

  const dispatch = useDispatch();
  
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {

    const loadUser = async () => {

      try {

        dispatch(setAuthLoading(true));

        if (!accessToken) {

          dispatch(logout());

          return;
        }

        const response =
          await api.get(
            "/auth/me"
          );

        dispatch(
          setCredentials({
            user:
              response.data.user,

            accessToken:
              accessToken,
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

  }, [dispatch, accessToken]);

  return null;
};

export default AuthLoader;