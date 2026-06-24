import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const defaultData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 72 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 80 },
  { day: "Fri", score: 84 },
  { day: "Sat", score: 90 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-md">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-xl font-bold text-cyan-400 leading-none">
          {payload[0].value}
          <span className="text-xs text-slate-500 font-normal ml-1">/ 100</span>
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ data = defaultData }) => {
  const chartData = data && data.length > 0 ? data : defaultData;
  const latest = chartData[chartData.length - 1]?.score || 0;
  const prev = chartData[chartData.length - 2]?.score || 0;
  const delta = latest - prev;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), transparent)" }} />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p className="font-mono uppercase tracking-widest text-[9px] text-slate-500 mb-1">
            Analytics
          </p>
          <h2 className="text-lg font-semibold text-white tracking-tight">Interview Performance</h2>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono uppercase tracking-widest text-[9px] text-slate-500 leading-none mb-1">
              Latest
            </p>
            <p className="text-2xl font-bold text-white leading-none">{latest}</p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-xl font-semibold border ${
              delta >= 0
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="transparent"
              tick={{ fill: "rgba(148, 163, 184, 0.7)", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="transparent"
              tick={{ fill: "rgba(148, 163, 184, 0.7)", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              domain={[55, 100]}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(6,182,212,0.3)", strokeWidth: 1, strokeDasharray: "4 4" }} />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#scoreGradient)"
              dot={{ fill: "#020617", stroke: "#06b6d4", strokeWidth: 2, r: 4 }}
              activeDot={{ fill: "#22d3ee", stroke: "rgba(6,182,212,0.4)", strokeWidth: 6, r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom week label */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 relative">
        <div className="flex gap-2">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  i === chartData.length - 1 ? "bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" : "bg-slate-700"
                }`}
              />
            </div>
          ))}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">This week</span>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;