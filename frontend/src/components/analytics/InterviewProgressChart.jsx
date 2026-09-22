// src/components/analytics/InterviewProgressChart.jsx

import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  { week: "Week 1", score: 62 },
  { week: "Week 2", score: 71 },
  { week: "Week 3", score: 78 },
  { week: "Week 4", score: 84 },
  { week: "Week 5", score: 89 },
  { week: "Week 6", score: 93 },
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Ambient Glow Effects */}
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
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <TrendingUp
                className="text-cyan-400"
                size={18}
              />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Progress Tracking
              </h2>
              <p className="text-[11px] text-slate-400">
                Weekly interview performance growth
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            AI Tracking
          </div>
        </div>

        {/* Compact Area Chart */}
        <div className="w-full h-[220px] sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="progressChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="week"
                stroke="#64748B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke="#64748B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />

              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px 12px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)"
                }}
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#22D3EE"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#progressChartGradient)"
                dot={{
                  r: 4,
                  fill: "#0F172A",
                  stroke: "#22D3EE",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#22D3EE",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compact Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 sm:p-3 hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-0.5 truncate">
              Current Score
            </p>
            <h3 className="text-cyan-400 font-extrabold text-sm sm:text-base">
              {lastScore}%
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 sm:p-3 hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-0.5 truncate">
              Improvement
            </p>
            <h3 className="text-emerald-400 font-extrabold text-sm sm:text-base">
              {improvement >= 0 ? `+${improvement}` : improvement}%
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 sm:p-3 hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-0.5 truncate">
              Avg Weekly Gain
            </p>
            <h3 className="text-purple-400 font-extrabold text-sm sm:text-base">
              {parseFloat(avgGain) >= 0 ? `+${avgGain}` : avgGain}%
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 sm:p-3 hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] uppercase font-mono text-slate-400 tracking-wider mb-0.5 truncate">
              Consistency
            </p>
            <h3 className="text-pink-400 font-extrabold text-sm sm:text-base">
              {consistency}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewProgressChart;