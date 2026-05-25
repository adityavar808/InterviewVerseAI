import axios from "axios";
import toast from "react-hot-toast";

import {
  clearStoredAdminSession,
  getAdminAccessToken,
  saveStoredAdminSession,
} from "../utils/adminHelpers";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
  withCredentials: true,
});

adminApi.interceptors.request.use(
  (config) => {
    const accessToken =
      getAdminAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest =
      error.config;

    const isRefreshRequest =
      originalRequest?.url?.includes(
        "/refresh-token",
      );
    const isLoginRequest =
      originalRequest?.url?.includes(
        "/login",
      );

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshRequest &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;

      try {
        const response =
          await axios.get(
            "http://localhost:5000/api/admin/refresh-token",
            {
              withCredentials: true,
            },
          );

        saveStoredAdminSession({
          admin: response.data.admin,
          accessToken:
            response.data.accessToken,
        });

        originalRequest.headers.Authorization =
          `Bearer ${response.data.accessToken}`;

        return adminApi(originalRequest);
      } catch (refreshError) {
        clearStoredAdminSession();

        toast.error(
          "Admin session expired. Please login again.",
        );

        if (
          window.location.pathname.startsWith(
            "/admin",
          )
        ) {
          window.location.href =
            "/admin-login";
        }

        return Promise.reject(
          refreshError,
        );
      }
    }

    return Promise.reject(error);
  },
);

export const adminService = {
  login: async (credentials) => {
    const response =
      await adminApi.post(
        "/login",
        credentials,
      );

    return response.data;
  },

  logout: async () => {
    const response =
      await adminApi.post("/logout");

    return response.data;
  },

  getMe: async () => {
    const response =
      await adminApi.get("/me");

    return response.data;
  },

  getDashboard: async () => {
    const response =
      await adminApi.get("/dashboard");

    return response.data;
  },

  getUsers: async (params) => {
    const response =
      await adminApi.get("/users", {
        params,
      });

    return response.data;
  },

  createUser: async (payload) => {
    const response =
      await adminApi.post(
        "/users",
        payload,
      );

    return response.data;
  },

  updateUser: async (
    userId,
    payload,
  ) => {
    const response =
      await adminApi.put(
        `/users/${userId}`,
        payload,
      );

    return response.data;
  },

  updateUserStatus: async (
    userId,
    status,
  ) => {
    const response =
      await adminApi.patch(
        `/users/${userId}/status`,
        { status },
      );

    return response.data;
  },

  deleteUser: async (userId) => {
    const response =
      await adminApi.delete(
        `/users/${userId}`,
      );

    return response.data;
  },

  getInterviews: async (params) => {
    const response =
      await adminApi.get(
        "/interviews",
        {
          params,
        },
      );

    return response.data;
  },

  createInterview: async (payload) => {
    const response =
      await adminApi.post(
        "/interviews",
        payload,
      );

    return response.data;
  },

  updateInterview: async (
    interviewId,
    payload,
  ) => {
    const response =
      await adminApi.put(
        `/interviews/${interviewId}`,
        payload,
      );

    return response.data;
  },

  deleteInterview: async (
    interviewId,
  ) => {
    const response =
      await adminApi.delete(
        `/interviews/${interviewId}`,
      );

    return response.data;
  },

  getCodingQuestions: async (
    params,
  ) => {
    const response =
      await adminApi.get(
        "/coding-questions",
        {
          params,
        },
      );

    return response.data;
  },

  createCodingQuestion: async (
    payload,
  ) => {
    const response =
      await adminApi.post(
        "/coding-questions",
        payload,
      );

    return response.data;
  },

  updateCodingQuestion: async (
    questionId,
    payload,
  ) => {
    const response =
      await adminApi.put(
        `/coding-questions/${questionId}`,
        payload,
      );

    return response.data;
  },

  deleteCodingQuestion: async (
    questionId,
  ) => {
    const response =
      await adminApi.delete(
        `/coding-questions/${questionId}`,
      );

    return response.data;
  },

  getReports: async () => {
    const response =
      await adminApi.get("/reports");

    return response.data;
  },

  getSettings: async () => {
    const response =
      await adminApi.get("/settings");

    return response.data;
  },

  updateSettings: async (payload) => {
    const response =
      await adminApi.put(
        "/settings",
        payload,
      );

    return response.data;
  },
};

export default adminApi;
