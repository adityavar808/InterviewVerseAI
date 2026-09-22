// src/components/profile/ProfileSubSidebar.jsx

import { motion } from "framer-motion";
import {
  User,
  Target,
  Trophy,
  Flame,
  Award,
  Link2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const PROFILE_TABS = [
  {
    id: "overview",
    label: "Overview & Profile",
    shortLabel: "Overview",
    description: "Stats, bio & career summary",
    icon: User,
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    activeGradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
    activeBorder: "border-cyan-500/50",
    activeIconColor: "text-cyan-400",
  },
  {
    id: "skills",
    label: "Skill Breakdown",
    shortLabel: "Skills",
    description: "Technical skills & radar scores",
    icon: Target,
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    activeGradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    activeBorder: "border-emerald-500/50",
    activeIconColor: "text-emerald-400",
  },
  {
    id: "achievements",
    label: "Achievements & Badges",
    shortLabel: "Achievements",
    description: "Badges & placement milestones",
    icon: Trophy,
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    activeGradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    activeBorder: "border-amber-500/50",
    activeIconColor: "text-amber-400",
  },
  {
    id: "certificates",
    label: "Certifications",
    shortLabel: "Certificates",
    description: "Verified certificates & credentials",
    icon: Award,
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    activeGradient: "from-indigo-500/20 via-indigo-500/10 to-transparent",
    activeBorder: "border-indigo-500/50",
    activeIconColor: "text-indigo-400",
  },
  {
    id: "social",
    label: "Social & Portfolio",
    shortLabel: "Social Links",
    description: "GitHub, LinkedIn & portfolio links",
    icon: Link2,
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    activeGradient: "from-pink-500/20 via-pink-500/10 to-transparent",
    activeBorder: "border-pink-500/50",
    activeIconColor: "text-pink-400",
  },
];

const ProfileSubSidebar = ({ activeTab, onSelectTab }) => {
  return (
    <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-3.5 flex flex-col gap-2 shadow-xl">
      {/* Sub-Sidebar Header */}
      <div className="px-2.5 pt-1 pb-2.5 border-b border-white/10 flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={15} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
            Profile Menu
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
          5 Modules
        </span>
      </div>

      {/* Mobile Horizontal Scrollable Pills */}
      <div className="lg:hidden flex overflow-x-auto gap-2 pb-1.5 scrollbar-none">
        {PROFILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                isActive
                  ? `${tab.badgeColor} border-current shadow-sm`
                  : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={14} className={isActive ? tab.activeIconColor : ""} />
              <span>{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Menu Items */}
      <div className="hidden lg:flex flex-col gap-1">
        {PROFILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative text-left w-full p-2.5 rounded-xl transition-all duration-200 border overflow-hidden flex items-center justify-between ${
                isActive
                  ? `bg-gradient-to-r ${tab.activeGradient} ${tab.activeBorder} shadow-md shadow-black/20`
                  : "bg-white/[0.015] border-white/5 hover:bg-white/[0.04] hover:border-white/10 text-slate-300"
              }`}
            >
              {/* Active Indicator Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="profileSubSidebarActiveGlow"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-violet-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-2.5 min-w-0 pl-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 border ${
                    isActive
                      ? tab.badgeColor
                      : "bg-white/5 border-white/10 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/20 group-hover:scale-105"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-xs font-bold truncate leading-tight ${
                      isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {tab.description}
                  </p>
                </div>
              </div>

              <ChevronRight
                size={13}
                className={`flex-shrink-0 transition-transform duration-200 ${
                  isActive
                    ? `${tab.activeIconColor} translate-x-0.5`
                    : "text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSubSidebar;
