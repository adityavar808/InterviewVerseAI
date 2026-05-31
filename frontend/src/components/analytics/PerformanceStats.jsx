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
            className={`
              relative
              overflow-hidden
              rounded-3xl
              border
              ${item.border}
              ${item.bg}
              backdrop-blur-xl
              p-6
            `}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            {/* Top */}
            <div className="flex items-center justify-between mb-6">
              
              <div
                className={`
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                `}
              >
                <Icon
                  className={item.color}
                  size={28}
                />
              </div>

              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                {item.growth}
              </div>
            </div>

            {/* Content */}
            <div>
              
              <h2 className="text-4xl font-bold text-white mb-2">
                {item.value}
              </h2>

              <p className="text-gray-400 text-sm">
                {item.title}
              </p>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PerformanceStats;