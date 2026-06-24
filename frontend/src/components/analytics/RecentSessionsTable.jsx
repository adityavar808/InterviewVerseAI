// src/components/analytics/RecentSessionsTable.jsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { studentService } from "../../services/studentApi";

import {
  Clock3,
  CheckCircle2,
  XCircle,
  Sparkles,
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
        <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full bg-purple-500/[0.06] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight mb-1">
              Recent Sessions
            </h2>

            <p className="text-xs text-slate-400">
              Latest AI interview performance history
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles size={13} />
            Session Analytics
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          
          <table className="w-full min-w-[800px]">
            
            <thead>
              <tr className="border-b border-white/10">
                
                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wider py-4">
                  Role
                </th>

                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wider py-4">
                  Interview Type
                </th>

                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wider py-4">
                  Score
                </th>

                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wider py-4">
                  Duration
                </th>

                <th className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wider py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              
              {displaySessions.map((session, index) => (
                <motion.tr
                  key={index}
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                  className="border-b border-white/5 transition-all duration-300"
                >
                  {/* Role */}
                  <td className="py-5">
                    
                    <div>
                      <h3 className="text-slate-200 font-semibold text-sm">
                        {session.role}
                      </h3>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-5">
                    
                    <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium w-fit">
                      {session.type}
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-5">
                    
                    <div className="text-base font-bold text-white">
                      {session.score}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-5">
                    
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      
                      <Clock3 size={15} />

                      {session.duration}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-5">
                    
                    {session.status === "Passed" ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium w-fit">
                        
                        <CheckCircle2 size={14} />

                        Passed
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium w-fit">
                        
                        <XCircle size={14} />

                        Needs Work
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
          <div className="relative">
            <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
              AI Performance Tracking
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Your recent interview sessions are continuously analyzed to identify strengths, weaknesses, and placement readiness trends using AI-powered evaluation models.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentSessionsTable;