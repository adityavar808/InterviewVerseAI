import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

import { forgotPassword } from "../../services/authService";

const securityFeatures = [
  {
    icon: Mail,
    title: "Instant Reset Link",
    sub: "Delivered securely to your registered email",
    color: "text-cyan-400",
    bg: "bg-cyan-400/[0.07] border-cyan-400/15",
    dot: "bg-cyan-400",
  },
  {
    icon: Lock,
    title: "15-Minute Expiration Token",
    sub: "Time-limited token for strict identity protection",
    color: "text-emerald-400",
    bg: "bg-emerald-400/[0.07] border-emerald-400/15",
    dot: "bg-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "Encrypted Recovery System",
    sub: "Protects your candidate account & interview data",
    color: "text-violet-400",
    bg: "bg-violet-400/[0.07] border-violet-400/15",
    dot: "bg-violet-400",
  },
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email address is required");
    }

    try {
      setLoading(true);
      const data = await forgotPassword(email);

      toast.success(
        data.message || "Password reset link sent to your email!"
      );
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send password reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-950">
      {/* Background Grid Overlay & Ambient Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -top-40 -left-20 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[90px]" />
      </div>

      {/* LEFT PANEL (Desktop Hero) */}
      <div className="relative hidden w-[46%] shrink-0 lg:flex lg:flex-col lg:justify-between overflow-hidden border-r border-white/[0.06] px-10 py-8 xl:px-14 xl:py-10">
        <div className="pointer-events-none absolute -right-16 top-0 h-full w-56 bg-gradient-to-b from-cyan-500/[0.05] via-transparent to-transparent skew-x-[-8deg]" />
        <div className="pointer-events-none absolute -right-6 top-0 h-full w-px bg-gradient-to-b from-cyan-400/20 via-cyan-400/5 to-transparent" />

        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20">
            <Sparkles size={14} className="text-cyan-400" />
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
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">
              Account Recovery
            </span>
          </div>

          <h2 className="text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
            Forgot your password?
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              We&apos;ve got you covered.
            </span>
          </h2>

          <p className="mt-2.5 max-w-xs text-[13px] leading-6 text-slate-400">
            Enter your registered email address and we&apos;ll send you a secure 1-click password reset link.
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
            Your candidate progress, ATS resume analyses, and mock interview scores remain safe.
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20">
              <Sparkles size={14} className="text-cyan-400" />
            </div>
            <p className="text-sm font-bold text-white">InterviewVerse AI</p>
          </div>

          {/* Navigation back to login */}
          <Link
            to="/login"
            className="group mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Sign In
          </Link>

          {/* Header Icon & Title */}
          <div className="mb-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <KeyRound size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Forgot Password
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Check your inbox</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an account exists for <span className="text-cyan-300 font-medium">{email}</span>, you will receive a password reset link shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs text-cyan-400 hover:underline"
              >
                Did not get email? Try again
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">
                  Email Address
                </label>
                <div
                  className={`rounded-xl border transition-all duration-200 ${
                    focused
                      ? "border-cyan-400/40 bg-cyan-400/[0.04] shadow-[0_0_0_3px_rgba(6,182,212,0.07)]"
                      : "border-white/[0.08] bg-white/[0.04]"
                  }`}
                >
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full bg-transparent px-4 py-3 text-[13px] text-white outline-none placeholder:text-slate-600"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 py-3 text-[13px] font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_18px_rgba(6,182,212,0.2)]"
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
                        className="inline-block h-3.5 w-3.5 rounded-full border-2 border-slate-950/30 border-t-slate-950"
                      />
                      Sending link…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="i"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Send Reset Link
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-slate-500">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;