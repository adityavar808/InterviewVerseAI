// src/components/settings/TwoFactorDisableModal.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, ShieldAlert, AlertCircle } from "lucide-react";
import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const TwoFactorDisableModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  const [otpToken, setOtpToken] = useState("");
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState("");

  const handleDisable = async (e) => {
    e.preventDefault();
    if (!otpToken || otpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    try {
      setIsDisabling(true);
      setError("");
      const response = await studentService.disable2FA({ otpToken });
      dispatch(setCredentials({ user: response.user, accessToken }));
      toast.success("Two-Factor Authentication disabled successfully.");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to disable 2FA";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-red-500/[0.04] blur-[60px]" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-slate-500/[0.03] blur-[50px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <ShieldAlert className="text-red-400" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Disable 2FA</h3>
                  <p className="text-xs text-slate-400">Remove two-factor authentication</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Disabling Two-Factor Authentication will reduce your account security. Please verify your identity by entering the current code from your Authenticator app.
              </p>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 mb-6">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p className="text-xs font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleDisable} className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                    Enter Authenticator Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 123456"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-4 text-center text-lg font-mono font-bold tracking-widest text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDisabling || otpToken.length !== 6}
                  className="w-full py-3.5 rounded-2xl bg-red-500 hover:bg-red-400 transition-all duration-200 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDisabling ? "Disabling..." : "Verify & Disable 2FA"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TwoFactorDisableModal;
