// src/components/profile/ActivityTimeline.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Clock3, Code2, Brain, Sparkles, CheckCircle2 } from "lucide-react";

const formatActivityTime = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const ActivityTimeline = () => {
  const user = useSelector((state) => state.auth.user || {});
  const interviewHistory = Array.isArray(user.interviewHistory) ? [...user.interviewHistory] : [];

  const recentActivities = interviewHistory
    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
    .slice(0, 4)
    .map((item) => ({
      title: item.title || "AI Interview",
      description: `${item.role ? `${item.role} · ` : ""}${item.difficulty || "Unknown difficulty"} · Score ${item.score ?? "N/A"}`,
      time: formatActivityTime(item.completedAt || item.createdAt || item.time),
      icon:
        item.difficulty?.toLowerCase() === "hard"
          ? Brain
          : item.difficulty?.toLowerCase() === "easy"
          ? CheckCircle2
          : Code2,
      color:
        item.difficulty?.toLowerCase() === "hard"
          ? "text-pink-400"
          : item.difficulty?.toLowerCase() === "easy"
          ? "text-emerald-400"
          : "text-violet-400",
      bg:
        item.difficulty?.toLowerCase() === "hard"
          ? "bg-pink-400/10"
          : item.difficulty?.toLowerCase() === "easy"
          ? "bg-emerald-400/10"
          : "bg-violet-400/10",
      border:
        item.difficulty?.toLowerCase() === "hard"
          ? "border-pink-400/20"
          : item.difficulty?.toLowerCase() === "easy"
          ? "border-emerald-400/20"
          : "border-violet-400/20",
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(139,92,246,0.25), transparent)",
          }}
        />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <Clock3 className="text-cyan-400" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">Activity Timeline</h2>
              <p className="text-xs text-slate-400 mt-0.5">Recent profile and interview activity</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-medium">
            <Sparkles size={11} />
            Live Tracking
          </span>
        </div>

        <div className="relative">
          <div
            className="absolute top-5 left-[23px] w-[1.5px] bottom-5"
            style={{
              background:
                "linear-gradient(to bottom, rgba(6,182,212,0.3), rgba(139,92,246,0.15), transparent)",
            }}
          />

          {recentActivities.length > 0 ? (
            <div className="space-y-5">
              {recentActivities.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.25 }}
                    className="relative flex gap-4"
                  >
                    <div
                      className={`relative z-10 w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${item.bg} ${item.border}`}
                    >
                      <Icon className={item.color} size={19} />
                    </div>

                    <div className="flex-1 min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 hover:border-cyan-400/20 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white mb-1 leading-tight">{item.title}</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-xl border border-white/10 bg-black/20 text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-slate-400">
              No recent interview activity yet. Complete interviews to populate this timeline.
            </div>
          )}
        </div>

        <div
          className="mt-5 rounded-2xl border border-white/10 px-5 py-4"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))",
          }}
        >
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white mb-1">AI Activity Summary</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your timeline now reflects actual interview sessions from your profile. Keep completing sessions
                to improve your live activity history.
              </p>
            </div>
          </div>
        </div>
      </div>
  </motion.div>
  );
};

export default ActivityTimeline;
