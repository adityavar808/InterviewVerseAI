import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Terminal,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { adminService } from "../../admin/services/adminApi";
import { saveStoredAdminSession } from "../../admin/utils/adminHelpers";

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "steps(1)" }}
      className="ml-0.5 inline-block h-3.5 w-0.5 bg-amber-400 align-middle"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const run = async () => {
      try {
        setIsSubmitting(true);
        setError("");
        const response = await adminService.login(formData);
        saveStoredAdminSession({
          admin: response.admin,
          accessToken: response.accessToken,
        });
        toast.success("Admin login successful");
        navigate("/admin");
      } catch (err) {
        const message = err.response?.data?.message || "Invalid admin credentials";
        setError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    };
    run();
  };

  return (
    <div className="relative flex min-h-screen items-stretch overflow-hidden bg-[#060a0f]">

      {/* ── Ambient background ──────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0">
        {/* corner glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/6 blur-[80px]" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/5 blur-[80px]" />
        {/* fine grid */}
        <div className="absolute inset-0 opacity-[0.028] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* scan line */}
        <motion.div
          initial={{ top: "-4px" }}
          animate={{ top: "100vh" }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/18 to-transparent pointer-events-none"
        />
      </div>

      {/* ════════════════════════ LEFT PANEL ════════════════════════ */}
      <div className="relative hidden w-[44%] shrink-0 border-r border-white/[0.07] lg:flex lg:flex-col lg:justify-between p-12 xl:p-16">

        {/* Top: brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/8">
            <ShieldCheck size={18} className="text-amber-400" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-[#060a0f] bg-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">InterviewVerse AI</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-600">Admin Operations</p>
          </div>
        </motion.div>

        {/* Middle: headline + access list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          {/* Terminal label */}
          <div className="mb-5 flex items-center gap-2">
            <Terminal size={12} className="text-amber-400/70" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-400/70">
              Secure_Access
            </span>
            <Cursor />
          </div>

          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
            Administrator<br />Control Panel
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Sign in to access operational controls. All sessions are encrypted and activity is logged.
          </p>

          {/* What you get access to */}
          <div className="mt-8 space-y-3">
            {[
              { label: "User management & role assignments" },
              { label: "Interview activity & content oversight" },
              { label: "Coding question library operations" },
              { label: "Platform analytics & reporting" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-amber-400/20 bg-amber-400/8">
                  <CheckCircle2 size={11} className="text-amber-400" />
                </div>
                <span className="text-sm text-slate-400">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom: security notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="rounded-[14px] border border-amber-400/10 bg-amber-400/[0.04] p-4"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-400/60" />
            <p className="text-xs leading-5 text-slate-600">
              Restricted to authorized administrators only. Unauthorized access attempts are flagged and reported.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════ RIGHT PANEL ════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile-only brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/8">
              <ShieldCheck size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">InterviewVerse AI</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Admin Panel</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-400">
                Restricted Access
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Login</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage users, content, and platform settings.
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-400/20 bg-rose-400/8 px-4 py-3">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-400" />
                  <p className="text-sm text-rose-300">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Admin Email
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "email"
                  ? "border-amber-400/40 bg-amber-400/[0.04] shadow-[0_0_0_3px_rgba(251,191,36,0.07)]"
                  : "border-white/[0.08] bg-white/[0.04]"
              }`}>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="admin@interviewverse.ai"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </label>
              <div className={`relative rounded-xl border transition-all duration-200 ${
                focusedField === "password"
                  ? "border-amber-400/40 bg-amber-400/[0.04] shadow-[0_0_0_3px_rgba(251,191,36,0.07)]"
                  : "border-white/[0.08] bg-white/[0.04]"
              }`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent px-4 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-slate-600"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 w-full overflow-hidden rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950"
                    />
                    Authenticating…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Lock size={14} />
                    Access Admin Panel
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Default credentials card */}
          {/* <div className="mt-6 rounded-[16px] border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-300">Default credentials</p>
              <span className="rounded-full border border-amber-400/15 bg-amber-400/8 px-2 py-0.5 font-mono text-[9px] text-amber-400 uppercase tracking-wider">
                Dev only
              </span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Email", value: "superadmin@interviewverse.ai" },
                { label: "Password", value: "Admin@123" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-600">{label}</span>
                  <span className="font-mono text-xs text-slate-400">{value}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Back to student login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-xs text-slate-600 hover:text-slate-300 transition-colors"
            >
              ← Back to Student Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;