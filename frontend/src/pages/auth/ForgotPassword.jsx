import { useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  forgotPassword,
} from "../../services/authService";

const ForgotPassword = () => {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!email) {

        return toast.error(
          "Email is required"
        );
      }

      try {

        setLoading(true);

        const data =
          await forgotPassword(email);

        toast.success(
          data.message ||
          "Reset link sent to your email"
        );

        setEmail("");

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black p-3 rounded-lg font-semibold"
          >
            {
              loading
                ? "Sending..."
                : "Send Reset Link"
            }
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Remember password?{" "}
          <Link
            to="/login"
            className="text-white"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;