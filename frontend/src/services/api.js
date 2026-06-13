import axios from "axios";

import toast from "react-hot-toast";

import store from "../app/store";
import {
  API_BASE_URL,
} from "../config/urls";

import {
  setCredentials,
  logout,
} from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: API_BASE_URL,

  withCredentials: true,
});

// REQUEST INTERCEPTOR

api.interceptors.request.use(

  (config) => {

    const token =
      store.getState().auth.accessToken;

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // ACCESS TOKEN EXPIRED

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        // REFRESH TOKEN REQUEST

        const response =
          await axios.get(
            `${API_BASE_URL}/auth/refresh-token`,

            {
              withCredentials: true,
            }
          );

        const newAccessToken =
          response.data.accessToken;

        // UPDATE REDUX

        const user =
          store.getState().auth.user;

        store.dispatch(
          setCredentials({
            user,

            accessToken:
              newAccessToken,
          })
        );

        // UPDATE LOCAL STORAGE

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        // RETRY ORIGINAL REQUEST

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        // SESSION EXPIRED

        localStorage.removeItem(
          "accessToken"
        );

        store.dispatch(logout());

        toast.error(
          "Session expired. Please login again."
        );

        window.location.href =
          "/login";

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
