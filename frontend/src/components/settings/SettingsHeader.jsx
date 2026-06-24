// src/components/settings/SettingsHeader.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  Settings,
  ShieldCheck,
  Sparkles,
  Bell,
} from "lucide-react";

const SettingsHeader = () => {
  const user = useSelector((state) => state.auth.user || {});

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
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

      <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        
        {/* Left */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <Settings
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                {user.name ? `Hello, ${user.name}` : "Settings"}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                {user.name
                  ? `Configure your account, security, and AI interview preferences for ${user.name}.`
                  : "Manage your account preferences & platform experience."}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs font-semibold">
              Account Preferences
            </span>

            <span className="px-3.5 py-1.5 rounded-full border border-purple-400/20 bg-purple-400/10 text-purple-300 text-xs font-semibold">
              AI Personalization
            </span>

            <span className="px-3.5 py-1.5 rounded-full border border-green-400/20 bg-green-400/10 text-green-300 text-xs font-semibold">
              Secure Settings
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 xl:flex-shrink-0">
          
          {/* Security */}
          <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all duration-200">
            <ShieldCheck
              className="text-cyan-400 flex-shrink-0"
              size={18}
            />

            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Security Status
              </p>

              <h3 className="text-slate-200 font-semibold text-xs leading-none">
                Fully Protected
              </h3>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-violet-400/10 border border-violet-400/20 text-violet-300 text-xs font-semibold">
            <Bell size={14} className="flex-shrink-0" />
            <span>Notifications Enabled</span>
          </div>
        </div>
      </div>

      {/* Bottom AI Note */}
      <div className="relative mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <Sparkles
          className="text-cyan-400 mt-0.5 flex-shrink-0"
          size={15}
        />

        <p className="text-xs text-slate-400 leading-relaxed">
          Customize your InterviewVerse AI experience,
          manage security preferences, personalize AI
          interview settings, and control platform
          notifications from one centralized dashboard.
        </p>
      </div>
    </motion.div>
  );
};

export default SettingsHeader;