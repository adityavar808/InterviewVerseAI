// src/components/analytics/AnalyticsSubSidebar.jsx

import { motion } from "framer-motion";
import {
  BarChart3,
  Target,
  Flame,
  AlertTriangle,
  Sparkles,
  History,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const ANALYTICS_TABS = [
  {
    id: "overview",
    label: "Overview & Growth",
    shortLabel: "Overview",
    description: "Key metrics & interview growth",
    icon: TrendingUp,
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    activeGradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
    activeBorder: "border-cyan-500/50",
    activeIconColor: "text-cyan-400",
  },
  {
    id: "skills",
    label: "Skill Analytics",
    shortLabel: "Skills",
    description: "Radar chart & skill breakdown",
    icon: Target,
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    activeGradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    activeBorder: "border-emerald-500/50",
    activeIconColor: "text-emerald-400",
  },
  {
    id: "heatmap",
    label: "Activity Heatmap",
    shortLabel: "Heatmap",
    description: "5-Month activity & streak map",
    icon: Flame,
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    activeGradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    activeBorder: "border-amber-500/50",
    activeIconColor: "text-amber-400",
  },
  {
    id: "weaknesses",
    label: "Weakness Analysis",
    shortLabel: "Weaknesses",
    description: "AI detected improvement areas",
    icon: AlertTriangle,
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    activeGradient: "from-rose-500/20 via-rose-500/10 to-transparent",
    activeBorder: "border-rose-500/50",
    activeIconColor: "text-rose-400",
  },
  {
    id: "insights",
    label: "AI Insights",
    shortLabel: "AI Insights",
    description: "Performance trends & feedback",
    icon: Sparkles,
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    activeGradient: "from-purple-500/20 via-purple-500/10 to-transparent",
    activeBorder: "border-purple-500/50",
    activeIconColor: "text-purple-400",
  },
  {
    id: "history",
    label: "Recent Sessions",
    shortLabel: "History",
    description: "Log of past completed sessions",
    icon: History,
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    activeGradient: "from-violet-500/20 via-violet-500/10 to-transparent",
    activeBorder: "border-violet-500/50",
    activeIconColor: "text-violet-400",
  },
];

const AnalyticsSubSidebar = ({ activeTab, onSelectTab }) => {
  return (
    <div className="bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-4 flex flex-col gap-2 shadow-2xl">
      {/* Sub-Sidebar Header */}
      <div className="px-3 pt-2 pb-3 border-b border-white/10 flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-cyan-400" size={16} />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
            Analytics Menu
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
          6 Modules
        </span>
      </div>

      {/* Mobile Horizontal Scrollable Pills */}
      <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {ANALYTICS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                isActive
                  ? `${tab.badgeColor} border-current shadow-[0_0_12px_rgba(6,182,212,0.25)]`
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
      <div className="hidden lg:flex flex-col gap-1.5">
        {ANALYTICS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative text-left w-full p-3 rounded-2xl transition-all duration-200 border overflow-hidden flex items-center justify-between ${
                isActive
                  ? `bg-gradient-to-r ${tab.activeGradient} ${tab.activeBorder} shadow-lg shadow-black/20`
                  : "bg-white/[0.015] border-white/5 hover:bg-white/[0.04] hover:border-white/10 text-slate-300"
              }`}
            >
              {/* Active Indicator Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="subSidebarAnalyticsActiveGlow"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-violet-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-3 min-w-0 pl-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 border ${
                    isActive
                      ? tab.badgeColor
                      : "bg-white/5 border-white/10 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/20 group-hover:scale-105"
                  }`}
                >
                  <Icon size={18} />
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
                size={14}
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

export default AnalyticsSubSidebar;
