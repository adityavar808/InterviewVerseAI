// src/components/profile/SkillsSection.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Code2, Sparkles, Brain, Database, Globe, Server } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    accent: "rgba(6,182,212,0.07)",
    accentHex: "#06b6d4",
    tagHover: "hover:border-cyan-400/30 hover:text-cyan-300",
    keywords: ["react", "tailwind", "javascript", "html", "css", "redux", "typescript", "frontend"],
  },
  {
    title: "Backend",
    icon: Server,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    accent: "rgba(139,92,246,0.07)",
    accentHex: "#8b5cf6",
    tagHover: "hover:border-violet-400/30 hover:text-violet-300",
    keywords: ["node", "express", "api", "jwt", "backend", "fastapi", "django", "flask"],
  },
  {
    title: "AI & ML",
    icon: Brain,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    accent: "rgba(244,114,182,0.07)",
    accentHex: "#f472b6",
    tagHover: "hover:border-pink-400/30 hover:text-pink-300",
    keywords: ["ai", "ml", "machine", "learning", "cnn", "whisper", "python"],
  },
  {
    title: "Database & Tools",
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    accent: "rgba(52,211,153,0.07)",
    accentHex: "#34d399",
    tagHover: "hover:border-emerald-400/30 hover:text-emerald-300",
    keywords: ["mongo", "git", "github", "postman", "vercel", "render", "database", "sql"],
  },
];

const SkillsSection = () => {
  const user = useSelector((state) => state.auth.user || {});
  const userSkills = Array.isArray(user.skills) ? user.skills : [];

  const visibleCategories = skillCategories
    .map((category) => ({
      ...category,
      skills: userSkills.filter((skill) =>
        category.keywords.some((keyword) => skill.toLowerCase().includes(keyword))
      ),
    }))
    .filter((category) => category.skills.length > 0);

  const fallbackSkills = userSkills.length > 0 ? userSkills : [];

  return (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-6 h-full"
  >
    {/* Glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-emerald-500/[0.05] blur-[50px]" />
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
           style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.5), rgba(6,182,212,0.3), transparent)" }} />
    </div>

    <div className="relative flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
            <Code2 className="text-emerald-400" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white leading-tight">Skills & Technologies</h2>
            <p className="text-xs text-slate-400 mt-0.5">Technical stack & expertise overview</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-medium">
          <Sparkles size={11} />
          AI Skill Mapping
        </span>
      </div>

      {userSkills.length > 0 && (
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Your Skills</p>
            <span className="text-[11px] text-slate-400">{userSkills.length} tagged</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="px-3 py-1 rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xs text-emerald-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
        {visibleCategories.length > 0 ? (
          visibleCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className={`relative overflow-hidden rounded-2xl border ${cat.border} p-5`}
                style={{ background: cat.accent }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                     style={{ background: `linear-gradient(90deg, ${cat.accentHex}80, transparent)` }} />

                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.bg}`}>
                    <Icon className={cat.color} size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{cat.title}</p>
                    <p className="text-[11px] text-slate-400">Technical expertise</p>
                  </div>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, j) => (
                    <span
                      key={j}
                      className={`px-3 py-1 rounded-xl border border-white/10 bg-black/20 text-xs text-slate-300 transition-all duration-200 ${cat.tagHover}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-slate-400">
            {fallbackSkills.length > 0
              ? "Your saved skills will appear here once they match a skill category."
              : "Add skills in your profile setup to see them grouped here."}
          </div>
        )}
      </div>

      {/* AI summary */}
      <div className="mt-5 rounded-2xl border border-white/10 px-5 py-4"
           style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(6,182,212,0.08))" }}>
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-white mb-1">AI Technical Analysis</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your stack strongly aligns with modern MERN and AI-powered SaaS roles. Continuing
              DSA practice and advanced backend architecture will further improve placement readiness.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

export default SkillsSection;