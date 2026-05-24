// src/components/resume/ATSRadarChart.jsx

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";
import { Activity, Sparkles } from "lucide-react";

const data = [
  {
    subject: "Technical",
    score: 85,
  },
  {
    subject: "Projects",
    score: 78,
  },
  {
    subject: "ATS",
    score: 82,
  },
  {
    subject: "Communication",
    score: 70,
  },
  {
    subject: "Skills",
    score: 88,
  },
  {
    subject: "Experience",
    score: 65,
  },
];

const ATSRadarChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        
        <div className="flex items-center gap-4">
          
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Activity className="text-cyan-400" size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              ATS Analytics
            </h2>

            <p className="text-sm text-gray-400">
              AI-powered resume performance insights
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          <Sparkles size={16} />
          Smart Analysis
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          
          <RadarChart data={data}>
            
            <PolarGrid stroke="rgba(255,255,255,0.1)" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#9CA3AF",
                fontSize: 13,
              }}
            />

            <Radar
              name="ATS"
              dataKey="score"
              stroke="#22D3EE"
              fill="#22D3EE"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-2">
            Best Area
          </p>

          <h3 className="text-cyan-400 font-semibold">
            Skills
          </h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-2">
            Weak Area
          </p>

          <h3 className="text-red-400 font-semibold">
            Experience
          </h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-2">
            Improvement
          </p>

          <h3 className="text-green-400 font-semibold">
            +12%
          </h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-xs text-gray-400 mb-2">
            Ranking
          </p>

          <h3 className="text-purple-400 font-semibold">
            Top 18%
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default ATSRadarChart;