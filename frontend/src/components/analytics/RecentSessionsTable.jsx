// src/components/analytics/RecentSessionsTable.jsx

import { motion } from "framer-motion";

import {
  Clock3,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const sessions = [
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

const RecentSessionsTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative
        overflow-hidden
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-6
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Recent Sessions
            </h2>

            <p className="text-sm text-gray-400">
              Latest AI interview performance history
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Session Analytics
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          
          <table className="w-full min-w-[800px]">
            
            <thead>
              <tr className="border-b border-white/10">
                
                <th className="text-left text-gray-400 font-medium py-4">
                  Role
                </th>

                <th className="text-left text-gray-400 font-medium py-4">
                  Interview Type
                </th>

                <th className="text-left text-gray-400 font-medium py-4">
                  Score
                </th>

                <th className="text-left text-gray-400 font-medium py-4">
                  Duration
                </th>

                <th className="text-left text-gray-400 font-medium py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              
              {sessions.map((session, index) => (
                <motion.tr
                  key={index}
                  whileHover={{
                    backgroundColor:
                      "rgba(255,255,255,0.03)",
                  }}
                  className="border-b border-white/5 transition-all duration-300"
                >
                  {/* Role */}
                  <td className="py-5">
                    
                    <div>
                      <h3 className="text-white font-medium">
                        {session.role}
                      </h3>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-5">
                    
                    <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm w-fit">
                      {session.type}
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-5">
                    
                    <div className="text-lg font-semibold text-white">
                      {session.score}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-5">
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      
                      <Clock3 size={16} />

                      {session.duration}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-5">
                    
                    {session.status === "Passed" ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm w-fit">
                        
                        <CheckCircle2 size={16} />

                        Passed
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm w-fit">
                        
                        <XCircle size={16} />

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
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Performance Tracking
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your recent interview sessions are continuously
            analyzed to identify strengths, weaknesses, and
            placement readiness trends using AI-powered
            evaluation models.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentSessionsTable;