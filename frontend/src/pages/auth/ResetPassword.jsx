import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

import { resetPassword } from "../../services/authService";

const securityFeatures = [
  {
    icon: Lock,
    title: "Strong Password Standards",
    sub: "Must be at least 6 characters long",
    color: "text-violet-400",
    bg: "bg-violet-400/[0.07] border-violet-400/15",
    dot: "bg-violet-400",
  },
  {
    icon: ShieldCheck,
    title: "Bcrypt Password Hashing",
    sub: "10-round salted hash stored safely in DB",
    color: "text-emerald-400",
    bg: "bg-emerald-400/[0.07] border-emerald-400/15",
    dot: "bg-emerald-400",
  },
  {
    icon: KeyRound,
    title: "One-Time Recovery Token",
    sub: "Token is invalidated immediately after use",
    color: "text-cyan-400",
    bg: "bg-cyan-400/[0.07] border-cyan-400/15",
    dot: "bg-cyan-400",
  },
];

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return toast.error("Both password fields are required");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const data = await resetPassword(token, {
        password: formData.password,
      });

      toast.success(data.message || "Password reset successful! Please sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired reset token"
      );
    } finally {
      setLoading(false);
    }
  };

  const isMatching =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-950">
      {/* Background Grid Overlay & Ambient Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -top-40 -left-20 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-600/10 blur-[90px]" />
      </div>

      {/* LEFT PANEL (Desktop Hero) */}
      <div className="relative hidden w-[46%] shrink-0 lg:flex lg:flex-col lg:justify-between overflow-hidden border-r border-white/[0.06] px-10 py-8 xl:px-14 xl:py-10">
        <div className="pointer-events-none absolute -right-16 top-0 h-full w-56 bg-gradient-to-b from-violet-500/[0.05] via-transparent to-transparent skew-x-[-8deg]" />
        <div className="pointer-events-none absolute -right-6 top-0 h-full w-px bg-gradient-to-b from-violet-400/20 via-violet-400/5 to-transparent" />

        {/* Brand header */}
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
            <p className="text-[13px] font-bold tracking-tight text-white">
              InterviewVerse AI
            </p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
              Career Prep Platform
            </p>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-400">
              Set New Password
            </span>
          </div>

          <h2 className="text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
            Create your new
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
              secure passcode.
            </span>
          </h2>

          <p className="mt-2.5 max-w-xs text-[13px] leading-6 text-slate-400">
            Choose a strong password to protect your candidate account and interview workspace.
          </p>

          {/* Security Features */}
          <div className="mt-6 space-y-2.5">
            {securityFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.08,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${feat.bg}`}
                >
                  <Icon size={14} className={feat.color} />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-white">
                      {feat.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{feat.sub}</p>
                  </div>
                  <div
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${feat.dot}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <p className="text-[12px] text-slate-400">
            Once reset, all active refresh sessions will be invalidated for security.
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL (Form Card) */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: "easeOut" }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile brand header */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10 border border-violet-400/20">
              <Sparkles size={14} className="text-violet-400" />
            </div>
            <p className="text-sm font-bold text-white">InterviewVerse AI</p>
          </div>

          {/* Navigation back to login */}
          <Link
            to="/login"
            className="group mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-violet-400 transition-colors"
          >
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Sign In
          </Link>

          {/* Header Icon & Title */}
          <div className="mb-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Reset Password
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
              Enter and confirm your new account password below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400">
                New Password
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focused === "password"
                    ? "border-violet-400/40 bg-violet-400/[0.04] shadow-[0_0_0_3px_rgba(139,92,246,0.07)]"
                    : "border-white/[0.08] bg-white/[0.04]"
                }`}
              >
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent px-4 py-3 pr-10 text-[13px] text-white outline-none placeholder:text-slate-600"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-400">
                  Confirm New Password
                </label>
                {isMatching && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <CheckCircle2 size={11} /> Passwords match
                  </span>
                )}
              </div>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${
                  focused === "confirmPassword"
                    ? "border-violet-400/40 bg-violet-400/[0.04] shadow-[0_0_0_3px_rgba(139,92,246,0.07)]"
                    : "border-white/[0.08] bg-white/[0.04]"
                }`}
              >
                <input
                  type={showPw ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent px-4 py-3 pr-10 text-[13px] text-white outline-none placeholder:text-slate-600"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 py-3 text-[13px] font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_18px_rgba(139,92,246,0.22)]"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="l"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Updating Password…
                  </motion.span>
                ) : (
                  <motion.span
                    key="i"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Update Password
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-slate-500">
              Ready to log in?{" "}
              <Link
                to="/login"
                className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Sign in to account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;