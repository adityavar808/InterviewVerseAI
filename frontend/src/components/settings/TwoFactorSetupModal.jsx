// src/components/settings/TwoFactorSetupModal.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, Key, Smartphone, AlertCircle, Sparkles } from "lucide-react";
import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const TwoFactorSetupModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const getSetupData = async () => {
        try {
          setIsLoading(true);
          setError("");
          const data = await studentService.setup2FA();
          setQrCodeUrl(data.qrCodeUrl);
          setSecret(data.secret);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to initiate 2FA setup");
          toast.error("Could not load 2FA setup.");
        } finally {
          setIsLoading(false);
        }
      };
      getSetupData();
    } else {
      setQrCodeUrl("");
      setSecret("");
      setOtpToken("");
      setError("");
    }
  }, [isOpen]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otpToken || otpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      const response = await studentService.verify2FA({ otpToken });
      dispatch(setCredentials({ user: response.user, accessToken }));
      toast.success("Two-Factor Authentication enabled successfully!");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to verify 2FA code";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
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
            className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-purple-500/[0.05] blur-[50px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                  <Smartphone className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Setup Authenticator</h3>
                  <p className="text-xs text-slate-400">Secure your account with TOTP</p>
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
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <p className="text-xs text-slate-400">Generating secure secret...</p>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 mb-6">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p className="text-xs font-semibold">{error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Step 1: Scan QR Code */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">
                      Scan this QR code with your Google Authenticator or Microsoft Authenticator app.
                    </p>
                    <div className="p-3 bg-white rounded-2xl shadow-xl w-fit">
                      {qrCodeUrl && (
                        <img
                          src={qrCodeUrl}
                          alt="2FA QR Code"
                          className="w-40 h-40 object-contain"
                        />
                      )}
                    </div>
                  </div>

                  {/* Step 2: Manual Key (Optional) */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Or manual key setup
                    </span>
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-cyan-400" />
                      <code className="text-xs text-slate-200 font-mono select-all tracking-wider">
                        {secret}
                      </code>
                    </div>
                  </div>

                  {/* Step 3: Enter OTP */}
                  <form onSubmit={handleVerify} className="space-y-4">
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
                      disabled={isVerifying || otpToken.length !== 6}
                      className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? "Verifying..." : "Verify & Enable 2FA"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TwoFactorSetupModal;
