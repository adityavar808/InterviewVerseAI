import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Mail,
  Lock,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

import api from "../../services/api";
import { setCredentials } from "../../redux/slices/authSlice";

const securityFeatures = [
  {
    icon: Mail,
    title: "Instant Code Delivery",
    sub: "Directly to your registered email inbox",
    color: "text-cyan-400",
    bg: "bg-cyan-400/[0.07] border-cyan-400/15",
    dot: "bg-cyan-400",
  },
  {
    icon: Lock,
    title: "Account Protection",
    sub: "Ensures only authorized candidates access workspace",
    color: "text-emerald-400",
    bg: "bg-emerald-400/[0.07] border-emerald-400/15",
    dot: "bg-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "256-Bit Encrypted Session",
    sub: "Strict token verification security protocols",
    color: "text-violet-400",
    bg: "bg-violet-400/[0.07] border-violet-400/15",
    dot: "bg-violet-400",
  },
];

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    } else if (location.state?.devOtp) {
      toast(`[DEV ONLY] OTP: ${location.state.devOtp}`, {
        icon: "🔑",
        duration: 8000,
      });
    }
  }, [email, location.state, navigate]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single character input
  const handleChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue && value !== "") return;

    const updatedOTP = [...otp];
    updatedOTP[index] = cleanValue.substring(0, 1);
    setOtp(updatedOTP);

    // Auto move to next input if filled
    if (cleanValue && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace / arrow navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle clipboard paste (e.g. "123456")
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);

    const targetIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${targetIndex}`)?.focus();
  };

  // Verify OTP submit handler
  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const enteredOTP = otp.join("");
    if (enteredOTP.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        email,
        otp: enteredOTP,
      });

      const { user, accessToken } = response.data;
      dispatch(setCredentials({ user, accessToken }));
      localStorage.setItem("accessToken", accessToken);

      toast.success(
        response.data.message || "Email verified & logged in successfully!"
      );

      navigate(
        user?.profileSetupDone === false ? "/complete-profile" : "/dashboard",
        { replace: true }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP submit handler
  const handleResendOTP = async () => {
    try {
      setResendLoading(true);

      const response = await api.post("/auth/resend-otp", { email });

      toast.success(response.data.message || "New OTP sent to email!");
      if (response.data?.otp) {
        toast(`[DEV ONLY] OTP: ${response.data.otp}`, {
          icon: "🔑",
          duration: 8000,
        });
      }

      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const isComplete = otp.join("").length === 6;

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-950">
      {/* Ambient background glow & grid overlay */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -top-40 -left-20 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[90px]" />
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
              Security Check
            </span>
          </div>

          <h2 className="text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
            Verify your email
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              to enter your workspace.
            </span>
          </h2>

          <p className="mt-2.5 max-w-xs text-[13px] leading-6 text-slate-400">
            We sent a 6-digit authorization passkey to your email address.
          </p>

          {/* Security highlight cards */}
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
            One-time security verification protects your interview recordings
            and ATS resume analytics.
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL (Main OTP Form Card) */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: "easeOut" }}
          className="w-full max-w-[420px]"
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

          {/* Form Card Header */}
          <div className="mb-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <KeyRound size={20} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Enter Passcode
            </h1>

            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
              Please enter the 6-digit verification code sent to:
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300">
              <Mail size={12} className="text-cyan-400" />
              <span>{email || "your email"}</span>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* 6 Digit Input Grid */}
            <div>
              <label className="mb-2.5 block text-center text-[11px] font-medium uppercase tracking-wider text-slate-400">
                6-Digit Verification Code
              </label>

              <div
                className="flex items-center justify-between gap-2 sm:gap-2.5"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => {
                  const isFocused = focusedIndex === index;
                  const isFilled = Boolean(digit);

                  return (
                    <motion.div
                      key={index}
                      animate={{ scale: isFocused ? 1.05 : 1 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1"
                    >
                      <input
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        className={`h-14 w-full rounded-xl text-center text-xl font-mono font-bold outline-none transition-all duration-200 ${
                          isFocused
                            ? "border-cyan-400 bg-cyan-500/[0.08] text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.25)] border-2"
                            : isFilled
                            ? "border-cyan-500/40 bg-white/[0.06] text-white border"
                            : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 border"
                        }`}
                        autoFocus={index === 0}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Submit Verification Button */}
            <button
              type="submit"
              disabled={loading || !isComplete}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 py-3.5 text-[13px] font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_24px_rgba(6,182,212,0.22)]"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
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
                    Verifying Code…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Verify & Continue
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Resend & Timer Section */}
          <div className="mt-6 flex flex-col items-center justify-center gap-2 border-t border-white/[0.06] pt-5">
            {timer > 0 ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Resend code available in</span>
                <span className="font-mono font-semibold text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                  {timer < 10 ? `0${timer}` : timer}s
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="group flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
              >
                <RotateCcw
                  size={13}
                  className={`transition-transform group-hover:rotate-180 duration-500 ${
                    resendLoading ? "animate-spin" : ""
                  }`}
                />
                {resendLoading ? "Sending new code…" : "Resend OTP Code"}
              </button>
            )}

            <p className="text-[11px] text-slate-500 text-center mt-1">
              Didn't receive the email? Check your spam folder or verify the
              email address above.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;
