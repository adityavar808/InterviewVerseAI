import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const interviews = [
  {
    role: "Frontend Developer",
    score: 84,
    date: "12 May 2026",
    status: "Completed",
    tech: ["React", "CSS"],
  },
  {
    role: "MERN Stack Developer",
    score: 78,
    date: "14 May 2026",
    status: "Completed",
    tech: ["MongoDB", "Node"],
  },
  {
    role: "AI Engineer",
    score: 91,
    date: "16 May 2026",
    status: "Completed",
    tech: ["Python", "ML"],
  },
];

const scoreColor = (score) => {
  if (score >= 90) return { text: "#4ade80", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.2)" };
  if (score >= 75) return { text: "#22d3ee", bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.2)" };
  return { text: "#fb923c", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.2)" };
};

const RecentInterviews = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-8 right-8 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.45), transparent)",
        }}
      />

      {/* Ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "250px", height: "250px",
          top: "-60px", right: "-60px",
          background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p
            className="font-mono uppercase tracking-widest mb-1"
            style={{ fontSize: "9px", color: "rgba(100,116,139,0.7)" }}
          >
            History
          </p>
          <h2 className="text-lg font-semibold text-slate-100">Recent Interviews</h2>
        </div>
        <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-1">
          View all <ArrowRight size={12} />
        </button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Role", "Score", "Date", "Status", ""].map((h, i) => (
                <th
                  key={i}
                  className="pb-3 text-left"
                  style={{
                    fontSize: "9px",
                    color: "rgba(100,116,139,0.6)",
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 500,
                    paddingRight: "16px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview, index) => {
              const sc = scoreColor(interview.score);
              return (
                <motion.tr
                  key={index}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="group transition-all cursor-pointer"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {/* Role */}
                  <td className="py-4 pr-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{interview.role}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {interview.tech.map((t, i) => (
                          <span
                            key={i}
                            className="text-xs px-1.5 py-0.5 rounded-md"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(148,163,184,0.7)",
                              fontSize: "10px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                      >
                        {interview.score}%
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 pr-4">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "rgba(100,116,139,0.75)" }}
                    >
                      {interview.date}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.7)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "#4ade80" }}
                      >
                        {interview.status}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4">
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Review <ExternalLink size={11} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div
        className="flex items-center justify-between mt-5 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p style={{ fontSize: "11px", color: "rgba(100,116,139,0.6)" }}>
          Showing <span style={{ color: "rgba(226,232,240,0.7)" }}>3</span> of{" "}
          <span style={{ color: "rgba(226,232,240,0.7)" }}>24</span> interviews
        </p>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: "11px", color: "rgba(100,116,139,0.6)" }}>Avg score:</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-md"
            style={{ background: "rgba(6,182,212,0.12)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.2)" }}
          >
            {Math.round(interviews.reduce((a, b) => a + b.score, 0) / interviews.length)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentInterviews;