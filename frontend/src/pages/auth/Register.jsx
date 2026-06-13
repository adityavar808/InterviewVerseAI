import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Brain,
  Code2,
  FileText,
  Sparkles,
  BarChart3,
} from "lucide-react";

import api from "../../services/api";
import {
  BACKEND_ORIGIN,
} from "../../config/urls";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const tracks = [
  { icon: Brain,     label: "Mock Interviews",    sub: "Frontend · Backend · HR",      color: "text-violet-400",  bg: "bg-violet-400/[0.07] border-violet-400/15",  dot: "bg-violet-400" },
  { icon: FileText,  label: "Resume Review",      sub: "ATS scoring · Keyword gaps",   color: "text-fuchsia-400", bg: "bg-fuchsia-400/[0.07] border-fuchsia-400/15", dot: "bg-fuchsia-400" },
  { icon: Code2,     label: "Coding Practice",    sub: "DSA · Logic · Test cases",     color: "text-indigo-400",  bg: "bg-indigo-400/[0.07] border-indigo-400/15",  dot: "bg-indigo-400" },
  { icon: BarChart3, label: "Progress Analytics", sub: "Streaks · Weak areas · Trends", color: "text-pink-400",   bg: "bg-pink-400/[0.07] border-pink-400/15",      dot: "bg-pink-400" },
];

const FieldWrap = ({ focused, hasError, children }) => (
  <div className={`rounded-xl border transition-all duration-200 ${
    focused
      ? "border-violet-400/40 bg-violet-400/[0.04] shadow-[0_0_0_3px_rgba(167,139,250,0.07)]"
      : hasError
      ? "border-rose-400/35 bg-rose-400/[0.03]"
      : "border-white/[0.08] bg-white/[0.04]"
  }`}>
    {children}
  </div>
);

const FieldError = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-1 text-[11px] text-rose-400"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const Register = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw]   = useState(false);
  const [focused, setFocused] = useState(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      };
      const response = await api.post("/auth/register", payload);
      toast.success(response.data.message || "Account created successfully");
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const fo = (name) => ({ onFocus: () => setFocused(name), onBlur: () => setFocused(null) });

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-950">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.028] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -top-40 -left-20 h-[440px] w-[440px] rounded-full bg-violet-500/5 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/5 blur-[70px]" />
      </div>

      {/* LEFT PANEL */}
      <div className="relative hidden w-[46%] shrink-0 lg:flex lg:flex-col lg:justify-between overflow-hidden border-r border-white/[0.06] px-10 py-8 xl:px-14 xl:py-10">

        <div className="pointer-events-none absolute -right-16 top-0 h-full w-56 bg-gradient-to-b from-violet-500/[0.05] via-transparent to-transparent skew-x-[-8deg]" />
        <div className="pointer-events-none absolute -right-6 top-0 h-full w-px bg-gradient-to-b from-violet-400/20 via-violet-400/5 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10 border border-violet-400/20">
            <Sparkles size={14} className="text-violet-400" />
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-tight text-white">InterviewVerse AI</p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-slate-600">Career Prep Platform</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-400">Join for free</span>
          </div>

          <h2 className="text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
            Land your dream<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              job, faster.
            </span>
          </h2>

          <p className="mt-2.5 max-w-xs text-[13px] leading-6 text-slate-500">
            Resume review, mock interviews, coding rounds, and analytics — one workspace.
          </p>

          <div className="mt-5 space-y-2">
            {tracks.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.08, duration: 0.35, ease: "easeOut" }}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${t.bg}`}
                >
                  <Icon size={13} className={t.color} />
                  <p className="flex-1 text-[13px] font-semibold text-white">{t.label}</p>
                  <p className="text-[11px] text-slate-600">{t.sub}</p>
                  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${t.dot}`} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] px-4 py-3.5"
        >
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400 text-[11px]">★</span>
            ))}
          </div>
          <p className="text-[12px] leading-5 text-slate-400 italic">
            "The mock interview feedback was specific enough to actually change how I answered."
          </p>
          <p className="mt-2 text-[10px] text-slate-600">— BTech CSE student, placed at a product company</p>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 overflow-y-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: "easeOut" }}
          className="w-full max-w-[360px]"
        >
          {/* Mobile brand */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10 border border-violet-400/20">
              <Sparkles size={14} className="text-violet-400" />
            </div>
            <p className="text-sm font-bold text-white">InterviewVerse AI</p>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Create account</h1>
            <p className="mt-1 text-[13px] text-slate-500">Start your placement prep journey today.</p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `${BACKEND_ORIGIN}/api/auth/google`;
            }}
            className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-[13px] text-slate-300 transition hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">or email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">First name</label>
                <FieldWrap focused={focused === "firstName"} hasError={!!errors.firstName}>
                  <input
                    type="text"
                    placeholder="John"
                    autoComplete="given-name"
                    {...register("firstName", { required: "Required" })}
                    {...fo("firstName")}
                    className="w-full bg-transparent px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-600"
                  />
                </FieldWrap>
                <FieldError message={errors.firstName?.message} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">Last name</label>
                <FieldWrap focused={focused === "lastName"} hasError={!!errors.lastName}>
                  <input
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    {...register("lastName", { required: "Required" })}
                    {...fo("lastName")}
                    className="w-full bg-transparent px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-600"
                  />
                </FieldWrap>
                <FieldError message={errors.lastName?.message} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">Email address</label>
              <FieldWrap focused={focused === "email"} hasError={!!errors.email}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                  })}
                  {...fo("email")}
                  className="w-full bg-transparent px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-600"
                />
              </FieldWrap>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">Password</label>
              <FieldWrap focused={focused === "password"} hasError={!!errors.password}>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    {...fo("password")}
                    className="w-full bg-transparent px-4 py-3 pr-10 text-[13px] text-white outline-none placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FieldWrap>
              <FieldError message={errors.password?.message} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">Confirm password</label>
              <FieldWrap focused={focused === "confirmPassword"} hasError={!!errors.confirmPassword}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                  {...fo("confirmPassword")}
                  className="w-full bg-transparent px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-600"
                />
              </FieldWrap>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3 text-[13px] font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_18px_rgba(139,92,246,0.22)]"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Creating account…
                  </motion.span>
                ) : (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    Create account
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Footer */}
          <p className="mt-4 text-center text-[13px] text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
