// src/components/profile/SocialLinksCard.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { GitBranch, Link, Globe, Mail, Sparkles, ExternalLink } from "lucide-react";

const buildLinks = (user = {}) => {
  const email = user.email || "";

  return [
    {
      title: "GitHub",
      value: user.githubUrl || "",
      icon: GitBranch,
      color: "text-white/70",
      bg: "bg-white/[0.06]",
      border: "border-white/10",
      accentHex: "#ffffff",
      glow: "rgba(255,255,255,0.04)",
      hover: "hover:border-white/20",
    },
    {
      title: "LinkedIn",
      value: user.linkedinUrl || "",
      icon: Link,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20",
      accentHex: "#06b6d4",
      glow: "rgba(6,182,212,0.07)",
      hover: "hover:border-cyan-400/30",
    },
    {
      title: "Portfolio",
      value: user.portfolioUrl || "",
      icon: Globe,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20",
      accentHex: "#8b5cf6",
      glow: "rgba(139,92,246,0.07)",
      hover: "hover:border-violet-400/30",
    },
    {
      title: "Email",
      value: email,
      icon: Mail,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      accentHex: "#34d399",
      glow: "rgba(52,211,153,0.07)",
      hover: "hover:border-emerald-400/30",
    },
  ];
};

const SocialLinksCard = () => {
  const user = useSelector((state) => state.auth.user || {});
  const links = buildLinks(user);
  const visibleLinks = links.filter((link) => link.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.05] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(52,211,153,0.25), transparent)" }} />
      </div>

      <div className="relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl font-semibold text-white leading-tight">Social Links</h2>
            <p className="text-xs text-slate-400 mt-0.5">Professional profiles & contact information</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-medium">
            <Sparkles size={11} />
            Connected Profiles
          </span>
        </div>

        {/* Links grid */}
        {visibleLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={i}
                  href={item.value}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  className={`relative overflow-hidden rounded-2xl border ${item.border} p-5 transition-all duration-200 ${item.hover}`}
                  style={{ background: item.glow }}
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                       style={{ background: `linear-gradient(90deg, ${item.accentHex}60, transparent)` }} />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                        <Icon className={item.color} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">{item.title}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{item.value}</p>
                      </div>
                    </div>

                    <span className="w-9 h-9 rounded-xl border border-white/10 bg-black/20 hover:border-cyan-400/20 hover:text-cyan-300 transition-all duration-200 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="text-slate-400" size={15} />
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-sm text-slate-400">
            No connected profiles available. Link GitHub, LinkedIn, portfolio, or email in your profile.
          </div>
        )}

        {/* AI summary */}
        <div className="mt-5 rounded-2xl border border-white/10 px-5 py-4"
             style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(52,211,153,0.08))" }}>
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white mb-1">AI Networking Summary</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your professional profiles strengthen online visibility, recruiter reach, and technical
                credibility while showcasing projects, coding skills, and interview performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialLinksCard;