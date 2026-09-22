// src/components/settings/SecuritySettings.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  Lock,
  Smartphone,
  MonitorSmartphone,
  LogOut,
} from "lucide-react";

import api from "../../services/api";
import { logout } from "../../redux/slices/authSlice";
import TwoFactorSetupModal from "./TwoFactorSetupModal";
import TwoFactorDisableModal from "./TwoFactorDisableModal";

// Helper to extract real browser, OS info and user system name
const parseDeviceInfo = (userName) => {
  if (typeof window === "undefined" || !navigator?.userAgent) {
    return { browser: "Web Browser", os: "Desktop", systemName: "User Device", isMobile: false };
  }

  const ua = navigator.userAgent;
  let os = "Desktop";
  let browser = "Web Browser";
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  if (ua.includes("Edg/")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome") && !ua.includes("Edg/")) browser = "Google Chrome";
  else if (ua.includes("Firefox")) browser = "Mozilla Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Apple Safari";
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";

  const systemName = userName ? `${userName}'s ${os}` : `${os} PC`;

  return { browser, os, systemName, isMobile };
};

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

  const deviceInfo = parseDeviceInfo(user?.name);

  const activeSessionsList = [
    {
      id: "current-session",
      device: `${deviceInfo.browser} on ${deviceInfo.os}`,
      systemName: deviceInfo.systemName,
      location: `Current Device • ${user?.email || "Authenticated Session"}`,
      status: "Active",
      isCurrent: true,
    },
  ];

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.05] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.55), rgba(139,92,246,0.3), transparent)" }}
        />
      </div>

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="text-cyan-400" size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-white leading-tight">Security Settings</h2>
              <p className="text-[11px] text-slate-400">Password updates, 2FA & active login sessions.</p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Password Update */}
          <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-2.5">
              <Lock className="text-cyan-400" size={16} />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Change Password</h3>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={isSavingPassword}
              className="w-full mt-2 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all text-slate-950 font-bold text-xs shadow-md disabled:opacity-50"
            >
              {isSavingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>

          {/* Right Column: 2FA + Active Sessions */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* 2FA Card */}
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-400/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="text-purple-400" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">2-Factor Authentication</h3>
                  <p className="text-[10px] text-slate-400">Authenticator App Protection</p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggle2FA}
                className={`w-11 h-6 rounded-full flex items-center px-0.5 border transition-all duration-300 ${
                  is2FAEnabled ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
                }`}
              >
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${is2FAEnabled ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"}`} />
              </button>
            </div>

            {/* Active Sessions Card */}
            <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <MonitorSmartphone className="text-emerald-400" size={16} />
                  <h3 className="text-xs font-bold text-white">Active Sessions</h3>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutAllDevices}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <LogOut size={11} />
                  <span>Logout All</span>
                </button>
              </div>

              <div className="space-y-2">
                {activeSessionsList.map((session) => (
                  <div key={session.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-xs hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <MonitorSmartphone className="text-emerald-400" size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-slate-200 font-medium text-[11px]">
                            {session.device}
                          </p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                            {session.systemName}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{session.location}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TwoFactorSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
      <TwoFactorDisableModal isOpen={isDisableOpen} onClose={() => setIsDisableOpen(false)} />
    </motion.div>
  );
};

export default SecuritySettings;
