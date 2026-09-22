// src/components/analytics/PerformanceStats.jsx

import { motion } from "framer-motion";

import {
  Trophy,
  Brain,
  Code2,
  Mic,
} from "lucide-react";

const defaultStats = [
  {
    title: "Total Interviews",
    value: "0",
    growth: "+100%",
    icon: Trophy,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glowColor: "rgba(34, 211, 238, 0.4)",
  },
  {
    title: "Average Score",
    value: "0%",
    growth: "+0%",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  {
    title: "Coding Accuracy",
    value: "0%",
    growth: "+0%",
    icon: Code2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glowColor: "rgba(52, 211, 153, 0.4)",
  },
  {
    title: "Communication",
    value: "0%",
    growth: "+0%",
    icon: Mic,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    glowColor: "rgba(244, 114, 182, 0.4)",
  },
];

const iconMap = {
  Trophy,
  Brain,
  Code2,
  Mic,
};

const PerformanceStats = ({ stats = defaultStats }) => {
  const displayStats = stats && stats.length > 0 ? stats.map((stat, index) => {
    const iconName = stat.icon || ["Trophy", "Brain", "Code2", "Mic"][index];
    const Icon = typeof stat.icon === "string" ? iconMap[stat.icon] : stat.icon || iconMap[iconName];
    
    return {
      ...stat,
      icon: Icon || Trophy,
      color: stat.color || defaultStats[index]?.color,
      bg: stat.bg || defaultStats[index]?.bg,
      border: stat.border || defaultStats[index]?.border,
    };
  }) : defaultStats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {displayStats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-slate-900/60
              backdrop-blur-md
              p-3.5 sm:p-4
              transition-all
              duration-200
              hover:border-white/25
              hover:bg-slate-900/80
              shadow-lg
              flex
              flex-col
              justify-between
            "
          >
            {/* Top Row: Icon + Growth Badge */}
            <div className="flex items-center justify-between mb-2">
              <div
                className={`
                  w-9
                  h-9
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  border
                  ${item.bg}
                  ${item.border}
                  flex-shrink-0
                  shadow-sm
                `}
              >
                <Icon
                  className={item.color}
                  size={18}
                />
              </div>

              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                {item.growth}
              </span>
            </div>

            {/* Bottom Row: Value & Label */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none mb-1">
                {item.value}
              </h3>
              <p className="text-slate-400 text-[11px] font-medium truncate">
                {item.title}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PerformanceStats;