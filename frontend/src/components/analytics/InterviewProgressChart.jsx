// src/components/analytics/InterviewProgressChart.jsx

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { motion } from "framer-motion";

import {
  TrendingUp,
  Sparkles,
} from "lucide-react";

const defaultData = [
  {
    week: "Week 1",
    score: 62,
  },
  {
    week: "Week 2",
    score: 71,
  },
  {
    week: "Week 3",
    score: 78,
  },
  {
    week: "Week 4",
    score: 84,
  },
  {
    week: "Week 5",
    score: 89,
  },
  {
    week: "Week 6",
    score: 93,
  },
];

const InterviewProgressChart = ({ data = defaultData }) => {
  const chartData = data && data.length > 0 ? data : defaultData;
  const firstScore = chartData[0]?.score ?? 0;
  const lastScore = chartData[chartData.length - 1]?.score ?? 0;
  const improvement = lastScore - firstScore;
  const avgGain = chartData.length > 1 ? (improvement / (chartData.length - 1)).toFixed(1) : "0.0";
  const consistency = improvement > 15 ? "Excellent" : improvement >= 0 ? "Good" : "Needs Work";

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
              <TrendingUp
                className="text-cyan-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Progress Tracking
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Weekly interview performance growth
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles size={13} />
            AI Tracking
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[380px]">
          
          <ResponsiveContainer width="100%" height="100%">
            
            <LineChart data={chartData}>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />

              <XAxis
                dataKey="week"
                stroke="#9CA3AF"
              />

              <YAxis
                stroke="#9CA3AF"
              />

              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
                  backdropFilter: "blur(12px)",
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#22D3EE"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#22D3EE",
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Current Score
            </p>

            <h3 className="text-cyan-400 font-semibold">
              {lastScore}%
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Improvement
            </p>

            <h3 className="text-green-400 font-semibold">
              {improvement >= 0 ? `+${improvement}` : improvement}%
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Avg Weekly Gain
            </p>

            <h3 className="text-purple-400 font-semibold">
              {parseFloat(avgGain) >= 0 ? `+${avgGain}` : avgGain}%
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Consistency
            </p>

            <h3 className="text-pink-400 font-semibold">
              {consistency}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewProgressChart;