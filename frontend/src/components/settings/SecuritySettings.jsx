// src/components/settings/SecuritySettings.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  Lock,
  Smartphone,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";

import api from "../../services/api";
import { logout } from "../../redux/slices/authSlice";
import TwoFactorSetupModal from "./TwoFactorSetupModal";
import TwoFactorDisableModal from "./TwoFactorDisableModal";

const activeSessions = [
  {
    device: "Chrome on Windows",
    location: "India",
    status: "Current Session",
  },
  {
    device: "Mobile App",
    location: "India",
    status: "Active",
  },
];

const STORAGE_KEY = "interviewverse_security_settings";

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const is2FAEnabled = !!user?.isTwoFactorEnabled;

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setIsSavingPassword(true);
      const response = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      if (response.data?.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data?.message || "Unable to update password.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Unable to update password. Please check your current password.";
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const toggle2FA = () => {
    if (is2FAEnabled) {
      setIsDisableOpen(true);
    } else {
      setIsSetupOpen(true);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setIsLoggingOut(true);
      await api.post("/auth/logout");
      dispatch(logout());
      toast.success("Logged out from all devices.");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Unable to logout from all devices.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-7"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.05] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.55), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="text-cyan-400" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">Security Settings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage password & account security</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-semibold">
            <Sparkles size={11} />
            Secure Account
          </span>
        </div>

        {/* Change Password Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6 hover:bg-white/[0.045] transition-all duration-300">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
              <Lock className="text-cyan-400" size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">Change Password</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Update your account password</p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200"
            />
          </div>

          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={isSavingPassword}
            className="mt-5 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* 2FA Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6 hover:bg-white/[0.045] transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="text-purple-400" size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">Two Factor Authentication</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Add extra security to your account</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggle2FA}
              className={`w-14 h-8 rounded-full flex items-center px-1 border transition-all duration-300 ${
                is2FAEnabled ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
              }`}
            >
              <div className={`w-6 h-6 rounded-full transition-all duration-300 ${is2FAEnabled ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"}`} />
            </button>
          </div>
        </div>

        {/* Active Sessions Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center flex-shrink-0">
              <MonitorSmartphone className="text-green-400" size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">Active Sessions</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Devices currently logged into your account</p>
            </div>
          </div>

          <div className="space-y-4">
            {activeSessions.map((session, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.04] transition-all duration-200"
              >
                <div>
                  <h4 className="text-slate-200 font-semibold text-sm">{session.device}</h4>
                  <p className="text-xs text-slate-400 mt-1">{session.location}</p>
                </div>

                <div className="px-3.5 py-1.5 rounded-full border border-green-400/20 bg-green-400/10 text-green-300 text-xs font-semibold w-fit">
                  {session.status}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleLogoutAllDevices}
            disabled={isLoggingOut}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout All Devices"}
          </button>
        </div>
      </div>

      <TwoFactorSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
      <TwoFactorDisableModal isOpen={isDisableOpen} onClose={() => setIsDisableOpen(false)} />
    </motion.div>
  );
};

export default SecuritySettings;
