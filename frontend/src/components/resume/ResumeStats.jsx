// src/components/resume/ResumeStats.jsx

import { motion } from "framer-motion";
import {
  Trophy,
  FileSearch,
  BriefcaseBusiness,
  Layers3,
} from "lucide-react";

const statsData = [
  {
    title: "ATS Score",
    value: "82/100",
    icon: Trophy,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Skills Found",
    value: "24",
    icon: Layers3,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Keyword Match",
    value: "87%",
    icon: FileSearch,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Projects Detected",
    value: "06",
    icon: BriefcaseBusiness,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const ResumeStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsData.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden rounded-3xl border ${item.border} ${item.bg} backdrop-blur-xl p-6`}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            {/* Top */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg}`}
              >
                <Icon className={item.color} size={28} />
              </div>

              <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Live
              </span>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {item.value}
              </h2>

              <p className="text-gray-400 text-sm">
                {item.title}
              </p>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ResumeStats;