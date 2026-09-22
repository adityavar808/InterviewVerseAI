// src/components/analytics/SkillRadarChart.jsx

import {
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
  { subject: "DSA", score: 0 },
  { subject: "React", score: 0 },
  { subject: "Backend", score: 0 },
  { subject: "Communication", score: 0 },
  { subject: "System Design", score: 0 },
  { subject: "Problem Solving", score: 0 },
];

const SkillRadarChart = ({ data = [] }) => {
  const chartData = data && data.length > 0 ? data : defaultData;
  const hasScores = chartData.some((item) => item.score > 0);
  
  // Calculate best and weak skills
  const bestSkill = hasScores
    ? chartData.reduce((max, current) => (current.score > max.score ? current : max))
    : { subject: "Not Assessed", score: 0 };

  const weakSkill = hasScores
    ? chartData.reduce((min, current) => (current.score < min.score ? current : min))
    : { subject: "Not Assessed", score: 0 };
  
  const avgRadarScore = hasScores
    ? Math.round(chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length)
    : 0;
  const dynamicImprovement = hasScores ? Math.max(0, Math.round(avgRadarScore - 50)) : 0;
  const dynamicRanking = hasScores ? `Top ${Math.max(1, Math.round(100 - avgRadarScore * 0.95))}%` : "N/A";

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
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Activity
                className="text-cyan-400"
                size={18}
              />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Skill Analytics
              </h2>
              <p className="text-[11px] text-slate-400">
                AI-based skill performance tracking
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            Smart Analysis
          </div>
        </div>

        {/* Compact Radar Chart */}
        <div className="w-full h-[230px] sm:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 15, right: 25, bottom: 15, left: 25 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: "#cbd5e1",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />

              <RadarArea
                name="Skills"
                dataKey="score"
                stroke="#22D3EE"
                strokeWidth={2}
                fill="#06B6D4"
                fillOpacity={0.25}
                dot={{ fill: "#0F172A", stroke: "#22D3EE", strokeWidth: 2, r: 3.5 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Compact Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Best Skill
            </p>
            <h3 className="text-cyan-400 font-extrabold text-xs sm:text-sm truncate" title={bestSkill.subject}>
              {bestSkill.subject}
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Weak Area
            </p>
            <h3 className="text-rose-400 font-extrabold text-xs sm:text-sm truncate" title={weakSkill.subject}>
              {weakSkill.subject}
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Improvement
            </p>
            <h3 className="text-emerald-400 font-extrabold text-xs sm:text-sm truncate">
              +{dynamicImprovement}%
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              AI Ranking
            </p>
            <h3 className="text-purple-400 font-extrabold text-xs sm:text-sm truncate">
              {dynamicRanking}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillRadarChart;