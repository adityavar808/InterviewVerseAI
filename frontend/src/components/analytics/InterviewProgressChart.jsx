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

const data = [
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

const InterviewProgressChart = () => {
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
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <TrendingUp
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Progress Tracking
              </h2>

              <p className="text-sm text-gray-400">
                Weekly interview performance growth
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Tracking
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[380px]">
          
          <ResponsiveContainer width="100%" height="100%">
            
            <LineChart data={data}>
              
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
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
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
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Current Score
            </p>

            <h3 className="text-cyan-400 font-semibold">
              93%
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Improvement
            </p>

            <h3 className="text-green-400 font-semibold">
              +31%
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Avg Weekly Gain
            </p>

            <h3 className="text-purple-400 font-semibold">
              +5.2%
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Consistency
            </p>

            <h3 className="text-pink-400 font-semibold">
              Excellent
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewProgressChart;