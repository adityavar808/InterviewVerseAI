import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const scoreColor = (score) => {
  if (score >= 90) {
    return {
      text: "#4ade80",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.2)",
    };
  }

  if (score >= 75) {
    return {
      text: "#22d3ee",
      bg: "rgba(6,182,212,0.12)",
      border: "rgba(6,182,212,0.2)",
    };
  }

  return {
    text: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.2)",
  };
};

const RecentInterviews = ({ interviews = [] }) => {
  const displayInterviews = Array.isArray(interviews) ? interviews : [];

  const avgScore =
    displayInterviews.length > 0
      ? Math.round(
          displayInterviews.reduce((acc, item) => acc + (item.score || 0), 0) /
            displayInterviews.length,
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5 md:p-6"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full bg-green-500/[0.04] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(74,222,128,0.5), transparent)" }} />
      </div>

      {/* Header */}
      <div className="relative mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 font-mono uppercase tracking-widest text-slate-500 text-[9px]">
            History
          </p>

          <h2 className="text-lg font-semibold text-white tracking-tight">
            Recent Interviews
          </h2>
        </div>

        <a href="/interviews" className="mt-1 flex items-center gap-1 text-xs text-cyan-400 transition-colors hover:text-cyan-300 active:scale-[0.98] cursor-pointer">
          View all <ArrowRight size={12} />
        </a>
      </div>

      {displayInterviews.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <p className="text-slate-400 text-sm font-medium mb-1">No recent interviews found</p>
          <p className="text-slate-500 text-xs mb-4">Start your first AI interview to begin tracking performance and history.</p>
          <a
            href="/interviews"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            Start Interview <ArrowRight size={12} />
          </a>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Role", "Score", "Date", "Status", ""].map((heading, index) => (
                    <th
                      key={index}
                      className="pb-3 text-left text-slate-500 font-mono text-[9px] uppercase tracking-wider font-semibold pr-4"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayInterviews.map((interview, index) => {
                  const sc = scoreColor(interview.score || 0);

                  return (
                    <motion.tr
                      key={index}
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.02)",
                      }}
                      className="group cursor-pointer transition-all border-b border-white/5"
                    >
                      {/* Role */}
                      <td className="py-4 pr-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-200">
                            {interview.role || interview.title || "Interview"}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            {(interview.tech || interview.tags || []).map((tech, i) => (
                              <span
                                key={i}
                                className="rounded-md px-1.5 py-0.5 text-[10px] bg-white/[0.04] border border-white/5 text-slate-400 font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-xl px-2.5 py-1 text-sm font-bold border"
                            style={{
                              background: sc.bg,
                              color: sc.text,
                              borderColor: sc.border,
                            }}
                          >
                            {interview.score || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 pr-4">
                        <span className="text-xs font-mono text-slate-400">
                          {interview.date || "Completed"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]"
                          />

                          <span className="text-xs text-green-400 font-medium">
                            {interview.status || "Completed"}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4">
                        <a
                          href="/interviews"
                          className="flex items-center gap-1 text-xs text-cyan-400 opacity-0 transition-opacity hover:text-cyan-300 group-hover:opacity-100"
                        >
                          Review <ExternalLink size={11} />
                        </a>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
            <p className="text-[11px] text-slate-500 font-medium">
              Showing <span className="text-slate-300 font-semibold">{displayInterviews.length}</span> interview{displayInterviews.length === 1 ? "" : "s"}
            </p>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">
                Avg score:
              </span>

              <span className="rounded-lg px-2 py-0.5 text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                {avgScore}%
              </span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default RecentInterviews;