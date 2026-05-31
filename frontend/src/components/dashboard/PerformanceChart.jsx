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
      <div
        style={{
          background: "rgba(2,6,23,0.95)",
          border: "1px solid rgba(6,182,212,0.3)",
          borderRadius: "12px",
          padding: "10px 14px",
          backdropFilter: "blur(24px)",
        }}
      >
        <p style={{ fontSize: "10px", color: "rgba(100,116,139,0.8)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
          {label}
        </p>
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#22d3ee", lineHeight: 1 }}>
          {payload[0].value}
          <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)", fontWeight: 400, marginLeft: "3px" }}>/ 100</span>
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
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-8 right-8 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)",
        }}
      />

      {/* Ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "300px", height: "300px",
          bottom: "-80px", left: "-60px",
          background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p
            className="font-mono uppercase tracking-widest mb-1"
            style={{ fontSize: "9px", color: "rgba(100,116,139,0.7)" }}
          >
            Analytics
          </p>
          <h2 className="text-lg font-semibold text-slate-100">Interview Performance</h2>
        </div>

        {/* Score pill */}
        <div className="flex items-center gap-3">
          <div
            className="text-right"
          >
            <p style={{ fontSize: "9px", color: "rgba(100,116,139,0.7)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Latest
            </p>
            <p className="text-2xl font-bold text-slate-50 leading-none">{latest}</p>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-xl font-semibold"
            style={{
              background: delta >= 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              color: delta >= 0 ? "#4ade80" : "#f87171",
              border: `1px solid ${delta >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
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
              tick={{ fill: "rgba(100,116,139,0.7)", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="transparent"
              tick={{ fill: "rgba(100,116,139,0.7)", fontSize: 11, fontFamily: "monospace" }}
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
      <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {chartData.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i === chartData.length - 1 ? "#22d3ee" : "rgba(100,116,139,0.3)",
                boxShadow: i === chartData.length - 1 ? "0 0 6px rgba(6,182,212,0.8)" : "none",
              }}
            />
          </div>
        ))}
        <span style={{ fontSize: "10px", color: "rgba(100,116,139,0.5)", fontFamily: "monospace" }}>This week</span>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;