import api from "./api";

export const forgotPassword =
  async (email) => {

    const response =
      await api.post(
        "/auth/forgot-password",
        { email }
      );

    return response.data;
};

export const resetPassword =
  async (
    token,
    passwords
  ) => {

    const response =
      await api.post(
        `/auth/reset-password/${token}`,
        passwords
      );

    return response.data;
};