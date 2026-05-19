import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  resetPassword,
} from "../../services/authService";

const ResetPassword = () => {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      password: "",
      confirmPassword: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !formData.password ||
        !formData.confirmPassword
      ) {

        return toast.error(
          "All fields are required"
        );
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {

        return toast.error(
          "Passwords do not match"
        );
      }

      try {

        setLoading(true);

        const data =
          await resetPassword(
            token,
            {
              password:
                formData.password,
            }
          );

        toast.success(
          data.message ||
          "Password reset successful"
        );

        navigate("/login");

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Invalid or expired token"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Reset Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-3 rounded-lg font-semibold"
          >
            {
              loading
                ? "Resetting..."
                : "Reset Password"
            }
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;