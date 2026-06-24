// src/components/analytics/SkillRadarChart.jsx

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Radar as RadarArea,
} from "recharts";

import { motion } from "framer-motion";

import {
  Activity,
  Sparkles,
} from "lucide-react";

const defaultData = [
  {
    subject: "DSA",
    score: 92,
  },
  {
    subject: "React",
    score: 88,
  },
  {
    subject: "Backend",
    score: 81,
  },
  {
    subject: "Communication",
    score: 84,
  },
  {
    subject: "System Design",
    score: 70,
  },
  {
    subject: "Problem Solving",
    score: 95,
  },
];

const SkillRadarChart = ({ data = defaultData }) => {
  const chartData = data && data.length > 0 ? data : defaultData;
  
  // Calculate best and weak skills
  const bestSkill = chartData.reduce((max, current) => 
    current.score > max.score ? current : max
  );
  const weakSkill = chartData.reduce((min, current) => 
    current.score < min.score ? current : min
  );
  
  const avgRadarScore = Math.round(chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length);
  const dynamicImprovement = Math.max(1, Math.round(avgRadarScore - 50));
  const dynamicRanking = Math.max(1, Math.round(100 - avgRadarScore * 0.95));

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
          
          <div className="flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Activity
                className="text-cyan-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Skill Analytics
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                AI-based skill performance tracking
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles size={13} />
            Smart Analysis
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[380px]">
          
          <ResponsiveContainer width="100%" height="100%">
            
            <RadarChart data={chartData}>
              
              <PolarGrid stroke="rgba(255,255,255,0.1)" />

              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: "#9CA3AF",
                  fontSize: 13,
                }}
              />

              <RadarArea
                name="Skills"
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
          
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Best Skill
            </p>

            <h3 className="text-cyan-400 font-semibold">
              {bestSkill.subject}
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Weak Area
            </p>

            <h3 className="text-red-400 font-semibold">
              {weakSkill.subject}
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Improvement
            </p>

            <h3 className="text-green-400 font-semibold">
              +{dynamicImprovement}%
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              AI Ranking
            </p>

            <h3 className="text-purple-400 font-semibold">
              Top {dynamicRanking}%
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillRadarChart;