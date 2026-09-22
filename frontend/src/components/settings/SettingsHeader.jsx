// src/components/settings/SettingsHeader.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Settings, ShieldCheck, Sliders } from "lucide-react";

const SettingsHeader = ({ activeTab, onSelectTab }) => {
  const user = useSelector((state) => state.auth.user || {});

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }}
        />
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & User Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Settings className="text-cyan-400" size={18} />
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight flex items-center gap-2">
              Settings & Preferences
            </h1>
            <p className="text-[11px] text-slate-400">
              {user.name
                ? `Account, security & AI personalization for ${user.name}`
                : "Manage your platform configuration & AI interview options"}
            </p>
          </div>
        </div>

        {/* Quick Status Chips */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => onSelectTab && onSelectTab("security")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-all duration-200"
            title="Click to view Security Settings"
          >
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Fully Protected</span>
          </button>

          <button
            onClick={() => onSelectTab && onSelectTab("preferences")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-all duration-200"
            title="Click to view AI Preferences"
          >
            <Sliders size={13} className="text-cyan-400" />
            <span>AI Personalization</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsHeader;