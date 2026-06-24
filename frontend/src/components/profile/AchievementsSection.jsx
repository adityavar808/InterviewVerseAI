// src/components/profile/AchievementsSection.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Star, Sparkles } from "lucide-react";

const AchievementsSection = () => {
  const user = useSelector((state) => state.auth.user || {});
  const interviews = Array.isArray(user.interviewHistory) ? user.interviewHistory.length : 0;
  const certifications = Array.isArray(user.certifications) ? user.certifications.length : 0;
  const skills = Array.isArray(user.skills) ? user.skills.length : 0;
  const streak = user.streak || 0;

  const achievements = [
    {
      title: `${interviews} Interview${interviews === 1 ? "" : "s"} Completed`,
      description: interviews
        ? `Recorded ${interviews} completed AI interview session${interviews === 1 ? "" : "s"}.`
        : "Start interviews to build your live performance history.",
      icon: Trophy,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      accentHex: "#fbbf24",
      glow: "rgba(251,191,36,0.07)",
    },
    {
      title: `${skills} Skill Tag${skills === 1 ? "" : "s"}`,
      description: skills
        ? `You have ${skills} saved skill${skills === 1 ? "" : "s"} in your profile.`
        : "Add your top skills to improve recruiter visibility.",
      icon: Medal,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20",
      accentHex: "#06b6d4",
      glow: "rgba(6,182,212,0.07)",
    },
    {
      title: `${streak} Day Streak`,
      description: streak
        ? `You are on a ${streak}-day learning streak.`
        : "Keep practicing daily to build momentum.",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20",
      accentHex: "#fb923c",
      glow: "rgba(251,146,60,0.07)",
    },
    {
      title: `${certifications} Certification${certifications === 1 ? "" : "s"}`,
      description: certifications
        ? `You’ve added ${certifications} certificate${certifications === 1 ? "" : "s"} to your profile.`
        : "Add certificates to showcase your credentials.",
      icon: Star,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20",
      accentHex: "#8b5cf6",
      glow: "rgba(139,92,246,0.07)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-amber-500/[0.06] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(251,191,36,0.55), rgba(6,182,212,0.25), transparent)",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="text-amber-400" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">Achievements</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live progress based on your profile activity</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-medium">
            <Sparkles size={11} />
            Career Progress
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className={`relative overflow-hidden rounded-2xl border ${item.border} p-5`}
                style={{ background: item.glow }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{ background: `linear-gradient(90deg, ${item.accentHex}80, transparent)` }}
                />
                <div className="flex gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                    <Icon className={item.color} size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white mb-1 leading-tight">{item.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          className="mt-5 rounded-2xl border border-white/10 px-5 py-4"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(139,92,246,0.08))",
          }}
        >
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white mb-1">AI Achievement Summary</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live progress metrics now reflect your actual interview activity, skills, certifications,
                and streak performance as stored in your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
  </motion.div>
  );
};

export default AchievementsSection;
 