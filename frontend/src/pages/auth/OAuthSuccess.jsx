import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Brain,
  Lock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { setCredentials, logout } from "../../redux/slices/authSlice";
import { API_BASE_URL } from "../../config/urls";

// ─── Google SVG ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const STEPS = [
  {
    id: "auth",
    label: "Authenticating OAuth Token",
    detail: "Validating cryptographic handshake",
    icon: ShieldCheck,
    color: "cyan",
  },
  {
    id: "profile",
    label: "Fetching Candidate Profile",
    detail: "Synchronizing user credentials & roles",
    icon: UserCheck,
    color: "violet",
  },
  {
    id: "session",
    label: "Initializing AI Workspace",
    detail: "Configuring mock interview environment",
    icon: Sparkles,
    color: "emerald",
  },
  {
    id: "redirect",
    label: "Launching Dashboard",
    detail: "Directing to secure workspace",
    icon: ArrowRight,
    color: "amber",
  },
];

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phase, setPhase] = useState("loading"); // loading | done | error
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [userData, setUserData] = useState(null);

  // Step ticker for visual sequence
  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 600);
    return () => clearInterval(interval);
  }, [phase]);

  // OAuth verification request
  useEffect(() => {
    const syncAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("Invalid access token");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("accessToken", token);
        dispatch(setCredentials({ accessToken: token, user: data.user }));
        setUserData(data.user);
        setPhase("done");
        setActiveStep(STEPS.length - 1);

        setTimeout(() => {
          navigate(
            data.user?.profileSetupDone === false
              ? "/complete-profile"
              : "/dashboard",
            { replace: true }
          );
        }, 1500);
      } catch (err) {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Unable to complete Google authentication";
        setPhase("error");
        setErrorMsg(msg);
        toast.error(msg);
      }
    };

    syncAuth();
  }, [dispatch, navigate]);

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F17] text-slate-100 flex items-center justify-center p-4 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* ─── Ambient Glow Background Blobs ───────────────────────────────────── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ─── Main Content Card ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 flex flex-col items-center"
      >
        {/* Top Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6"
        >
          <Brain className="w-3.5 h-3.5" />
          <span>InterviewVerse AI • Authentication</span>
        </motion.div>

        {/* ─── Orbital Animated Graphic Container ──────────────────────────── */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          {/* External Rotating Halo Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 rounded-full border-2 border-dashed ${
              phase === "done"
                ? "border-emerald-500/40"
                : phase === "error"
                ? "border-rose-500/40"
                : "border-cyan-500/40"
            }`}
          />

          {/* Inner Counter-Rotating Pulse Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-2 rounded-full border border-gradient ${
              phase === "done"
                ? "border-emerald-400/20 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                : phase === "error"
                ? "border-rose-400/20 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
                : "border-cyan-400/20 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
            }`}
          />

          {/* Pulse Waves on Success */}
          {phase === "done" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400/60 pointer-events-none"
            />
          )}

          {/* Center Glass Disc */}
          <div
            className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center bg-slate-950/80 border backdrop-blur-md transition-colors duration-500 ${
              phase === "done"
                ? "border-emerald-500/50 shadow-lg shadow-emerald-500/20 text-emerald-400"
                : phase === "error"
                ? "border-rose-500/50 shadow-lg shadow-rose-500/20 text-rose-400"
                : "border-cyan-500/50 shadow-lg shadow-cyan-500/20 text-cyan-400"
            }`}
          >
            <AnimatePresence mode="wait">
              {phase === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center justify-center"
                >
                  <GoogleIcon />
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div
                  key="done"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </motion.div>
              )}
              {phase === "error" && (
                <motion.div
                  key="error"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <AlertCircle className="w-10 h-10 text-rose-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Title & Subtitle ────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <motion.h1
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
          >
            {phase === "done"
              ? "Access Granted!"
              : phase === "error"
              ? "Authentication Failed"
              : "Verifying Account"}
          </motion.h1>
          <motion.p
            key={phase + "-sub"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed"
          >
            {phase === "done"
              ? "Your session has been cryptographically secured. Launching your workspace..."
              : phase === "error"
              ? errorMsg || "Unable to sync Google credentials. Please try signing in again."
              : "Synchronizing security tokens and preparing your personalized AI environment..."}
          </motion.p>
        </div>

        {/* ─── User Profile Chip (When Done) ───────────────────────────────── */}
        {phase === "done" && userData && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
          >
            {userData.avatar || userData.picture ? (
              <img
                src={userData.avatar || userData.picture}
                alt={userData.name}
                className="w-9 h-9 rounded-full border border-emerald-400/40 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
                {(userData.name || userData.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-100 truncate">
                {userData.name || "Candidate"}
              </p>
              <p className="text-[11px] text-emerald-400/80 truncate">
                {userData.email}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-medium border border-emerald-400/30">
              Verified
            </span>
          </motion.div>
        )}

        {/* ─── Step List (Loading / Done) ───────────────────────────────────── */}
        {phase !== "error" && (
          <div className="w-full space-y-2.5 mb-6">
            {STEPS.map((step, idx) => {
              const isDone = phase === "done" || idx < activeStep;
              const isActive = phase === "loading" && idx === activeStep;
              const StepIcon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                    isDone
                      ? "bg-slate-900/80 border-emerald-500/30 shadow-sm shadow-emerald-950/20"
                      : isActive
                      ? "bg-slate-800/80 border-cyan-500/50 shadow-md shadow-cyan-950/40"
                      : "bg-slate-950/40 border-slate-800/50 opacity-40"
                  }`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isActive
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse"
                        : "bg-slate-800 text-slate-500 border border-slate-700/50"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Step Label & Detail */}
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`text-xs font-medium transition-colors ${
                        isDone
                          ? "text-slate-200"
                          : isActive
                          ? "text-cyan-300 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {step.detail}
                    </p>
                  </div>

                  {/* Status Indicator Pill */}
                  {isDone && (
                    <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Done
                    </span>
                  )}
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Syncing
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─── Error Action Button ────────────────────────────────────────── */}
        {phase === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3 mb-4"
          >
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </motion.div>
        )}

        {/* ─── Card Footer Security Badge ───────────────────────────────────── */}
        <div className="w-full pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400/70" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            OAuth v2.0
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthSuccess;