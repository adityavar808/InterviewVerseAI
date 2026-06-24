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
    value: "148",
    growth: "+18%",
    icon: Trophy,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Average Score",
    value: "89%",
    growth: "+6%",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Coding Accuracy",
    value: "93%",
    growth: "+12%",
    icon: Code2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Communication",
    value: "84%",
    growth: "+9%",
    icon: Mic,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {displayStats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.035]
              backdrop-blur-xl
              p-5
              transition-all
              duration-300
              hover:border-white/20
            "
          >
            {/* Glow and top border indicator based on item color */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full opacity-[0.12] blur-[40px]"
                   style={{
                     backgroundColor:
                       item.color.includes("cyan") ? "rgb(34,211,238)" :
                       item.color.includes("purple") ? "rgb(167,139,250)" :
                       item.color.includes("green") ? "rgb(74,222,128)" :
                       item.color.includes("pink") ? "rgb(244,114,182)" : "rgb(34,211,238)"
                   }}
              />
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
                   style={{
                     background: `linear-gradient(90deg, ${
                       item.color.includes("cyan") ? "rgba(34,211,238,0.5)" :
                       item.color.includes("purple") ? "rgba(167,139,250,0.5)" :
                       item.color.includes("green") ? "rgba(74,222,128,0.5)" :
                       item.color.includes("pink") ? "rgba(244,114,182,0.5)" : "rgba(34,211,238,0.5)"
                     }, transparent)`
                   }}
              />
            </div>

            {/* Top */}
            <div className="flex items-center justify-between mb-6 relative">
              
              <div
                className={`
                  w-12
                  h-12
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  border
                  ${item.bg}
                  ${item.border}
                `}
              >
                <Icon
                  className={item.color}
                  size={24}
                />
              </div>

              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                {item.growth}
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              
              <h2 className="text-3xl font-bold text-white mb-1.5 tracking-tight">
                {item.value}
              </h2>

              <p className="text-slate-400 text-sm font-medium">
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