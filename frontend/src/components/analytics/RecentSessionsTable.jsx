// src/components/analytics/RecentSessionsTable.jsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { studentService } from "../../services/studentApi";

import {
  Clock3,
  CheckCircle2,
  XCircle,
  Sparkles,
  History,
} from "lucide-react";

const defaultSessions = [
  {
    role: "Frontend Developer",
    type: "Technical Interview",
    score: "92%",
    duration: "42 min",
    status: "Passed",
  },
  {
    role: "MERN Stack Developer",
    type: "Coding Interview",
    score: "87%",
    duration: "55 min",
    status: "Passed",
  },
  {
    role: "ML Engineer",
    type: "Behavioral Interview",
    score: "71%",
    duration: "36 min",
    status: "Needs Work",
  },
  {
    role: "Backend Developer",
    type: "System Design",
    score: "81%",
    duration: "49 min",
    status: "Passed",
  },
];

const RecentSessionsTable = ({ sessions: propSessions }) => {
  const [sessionsList, setSessionsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propSessions && propSessions.length > 0) {
      setSessionsList(propSessions);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await studentService.getInterviewHistory();
        if (data && data.length > 0) {
          const formatted = data.map(item => {
            const scoreNum = parseInt(item.score) || 0;
            return {
              role: item.role || item.title || "AI Interview",
              type: `${item.difficulty || "Medium"} Level`,
              score: `${scoreNum}%`,
              duration: item.duration || "30 Min",
              status: scoreNum >= 70 ? "Passed" : "Needs Work",
            };
          });
          setSessionsList(formatted);
        }
      } catch (err) {
        console.error("Failed to load interview history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [propSessions]);

  const displaySessions = sessionsList.length > 0 ? sessionsList : defaultSessions;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <History className="text-violet-400" size={18} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Recent Sessions
              </h2>
              <p className="text-[11px] text-slate-400">
                Latest AI interview performance history
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            Session Analytics
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[340px] rounded-xl border border-white/5 pr-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md">
              <tr className="border-b border-white/10">
                <th className="text-slate-400 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 bg-slate-900/95">
                  Role
                </th>
                <th className="text-slate-400 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 bg-slate-900/95">
                  Interview Type
                </th>
                <th className="text-slate-400 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 bg-slate-900/95">
                  Score
                </th>
                <th className="text-slate-400 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 bg-slate-900/95">
                  Duration
                </th>
                <th className="text-slate-400 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 bg-slate-900/95">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {displaySessions.map((session, index) => (
                <motion.tr
                  key={index}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="transition-colors duration-150"
                >
                  {/* Role */}
                  <td className="py-3 px-3">
                    <h3 className="text-slate-200 font-bold text-xs sm:text-sm">
                      {session.role}
                    </h3>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold inline-block">
                      {session.type}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-3 px-3">
                    <span className="text-sm font-extrabold text-white">
                      {session.score}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs font-medium">
                      <Clock3 size={13} className="text-slate-400" />
                      {session.duration}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {session.status === "Passed" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                        <CheckCircle2 size={12} />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold">
                        <XCircle size={12} />
                        Needs Work
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Info */}
        <div className="mt-4 bg-white/[0.025] border border-white/10 rounded-xl p-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
          <div className="relative">
            <h3 className="text-xs font-bold text-white mb-0.5 tracking-tight">
              AI Performance Tracking
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your recent interview sessions are continuously analyzed to identify strengths, weaknesses, and placement readiness trends using AI-powered evaluation models.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentSessionsTable;