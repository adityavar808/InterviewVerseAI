import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { adminService } from "../../admin/services/adminApi";
import { saveStoredAdminSession } from "../../admin/utils/adminHelpers";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitLogin = async () => {
      try {
        setIsSubmitting(true);
        setError("");

        const response =
          await adminService.login(
            formData,
          );

        saveStoredAdminSession({
          admin: response.admin,
          accessToken:
            response.accessToken,
        });

        toast.success(
          "Admin login successful",
        );
        navigate("/admin");
      } catch (requestError) {
        const message =
          requestError.response?.data
            ?.message ||
          "Invalid admin credentials";

        setError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    };

    submitLogin();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:38px_38px]" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden border-r border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.18),rgba(15,23,42,0.6),rgba(245,158,11,0.08))] p-16 lg:flex lg:flex-col lg:justify-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15">
              <ShieldCheck
                size={34}
                className="text-cyan-300"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                InterviewVerse AI
              </h1>

              <p className="mt-2 text-slate-300">
                Operations, analytics, and platform controls in one workspace.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                <Sparkles size={12} />
                Growth visibility
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                Live operational overview
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Review user growth, content inventory, publishing coverage, and admin alerts without leaving the dashboard.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                Secure administrative access
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                The backend now provisions the default admin account automatically, so these credentials map to a real admin user instead of a hardcoded browser check.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                Admin access
              </p>
              <h2 className="mt-3 text-4xl font-bold text-white">
                Admin Login
              </h2>

              <p className="mt-3 text-slate-400">
                Sign in to manage users, content, reporting, and platform settings.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Admin Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400/40"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 py-4 font-semibold text-slate-950 transition duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Login to Admin Panel"}
              </button>
            </form>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <h4 className="mb-3 font-medium text-white">
                Default admin credentials
              </h4>

              <div className="space-y-2 text-sm text-slate-400">
                <p>Email: superadmin@interviewverse.ai</p>
                <p>Password: Admin@123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
