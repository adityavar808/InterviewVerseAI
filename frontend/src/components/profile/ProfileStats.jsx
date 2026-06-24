// src/components/profile/ProfileStats.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Trophy, Flame, Brain, FileText } from "lucide-react";

const ProfileStats = () => {
  const user = useSelector((state) => state.auth.user || {});
  const interviewHistory = Array.isArray(user.interviewHistory) ? user.interviewHistory : [];
  const interviewCount = interviewHistory.length;
  const averageScore = interviewCount
    ? Math.round(interviewHistory.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / interviewCount)
    : null;

  const stats = [
    {
      title: "Interviews Completed",
      value: `${interviewCount}`,
      growth: `${interviewCount > 0 ? `+${Math.min(100, interviewCount)}%` : "0%"}`,
      icon: Trophy,
      accent: "#06b6d4",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20",
      glow: "rgba(6,182,212,0.08)",
    },
    {
      title: "Current Streak",
      value: `${user.streak || 0} Days`,
      growth: user.streak > 0 ? "+5%" : "0%",
      icon: Flame,
      accent: "#fb923c",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20",
      glow: "rgba(251,146,60,0.08)",
    },
    {
      title: "Coding Accuracy",
      value: user.codingAccuracy || (averageScore !== null ? `${averageScore}%` : "N/A"),
      growth: averageScore !== null ? "+12%" : "N/A",
      icon: Brain,
      accent: "#a78bfa",
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20",
      glow: "rgba(167,139,250,0.08)",
    },
    {
      title: "ATS Resume Score",
      value: user.atsResumeScore || user.resumeScore || "N/A",
      growth: user.atsResumeScore || user.resumeScore ? "+9%" : "N/A",
      icon: FileText,
      accent: "#34d399",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      glow: "rgba(52,211,153,0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-3xl border ${item.border} bg-white/[0.035] backdrop-blur-xl p-6`}
          >
            {/* Glow */}
            <div
              className="pointer-events-none absolute -top-10 -left-10 h-36 w-36 rounded-full blur-[40px]"
              style={{ background: item.glow }}
            />
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${item.accent}99, transparent)` }}
            />

            <div className="relative">
              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg}`}>
                  <Icon className={item.color} size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-[11px] font-medium">
                  {item.growth}
                </span>
              </div>

              {/* Value */}
              <p className="text-3xl font-bold text-white mb-1 tracking-tight">{item.value}</p>
              <p className="text-xs text-slate-400">{item.title}</p>
            </div>

            {/* Bottom shimmer */}
            <div className="absolute bottom-0 left-0 w-full h-[1px]"
                 style={{ background: `linear-gradient(90deg, transparent, ${item.accent}33, transparent)` }} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProfileStats;