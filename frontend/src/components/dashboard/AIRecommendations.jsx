import { Sparkles, TrendingUp, Brain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const recommendations = [
  {
    icon: TrendingUp,
    title: "Communication Improved",
    description: "Your communication score improved by 12% this week.",
    accent: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.25)", icon: "#22d3ee", glow: "rgba(6,182,212,0.1)" },
    badge: "+12%",
    badgeColor: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
  },
  {
    icon: Brain,
    title: "AI Suggestion",
    description: "Practice more system design interviews to strengthen architecture thinking.",
    accent: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)", icon: "#a78bfa", glow: "rgba(139,92,246,0.1)" },
    badge: "Suggested",
    badgeColor: { bg: "rgba(167,139,250,0.15)", text: "#a78bfa" },
  },
  {
    icon: Sparkles,
    title: "Coding Recommendation",
    description: "Focus on medium-level DSA problems for better interview performance.",
    accent: { bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.25)", icon: "#fb923c", glow: "rgba(249,115,22,0.1)" },
    badge: "Priority",
    badgeColor: { bg: "rgba(251,146,60,0.15)", text: "#fb923c" },
  },
];

const AIRecommendations = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full bg-purple-500/[0.05] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.5), transparent)" }} />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p className="font-mono uppercase tracking-widest text-[9px] text-slate-500 mb-1">
            Insights
          </p>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-semibold text-white tracking-tight">AI Recommendations</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-400 font-mono uppercase tracking-widest text-[9px]">
                Live
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-1 cursor-pointer">
          View all <ArrowRight size={12} />
        </button>
      </div>

      {/* Cards */}
      <div className="relative space-y-3">
        {recommendations.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-start gap-4 p-4 rounded-2xl cursor-default transition-all duration-300 bg-white/[0.03] border border-white/10 hover:bg-white/[0.045]"
            >
              {/* Icon box */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  background: item.accent.bg,
                  borderColor: item.accent.border,
                  boxShadow: `0 0 16px ${item.accent.glow}`,
                }}
              >
                <Icon size={18} style={{ color: item.accent.icon }} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white tracking-tight">{item.title}</h3>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-md font-semibold flex-shrink-0"
                    style={{
                      background: item.badgeColor.bg,
                      color: item.badgeColor.text,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AIRecommendations;