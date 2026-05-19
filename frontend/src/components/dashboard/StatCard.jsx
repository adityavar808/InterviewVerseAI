import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl p-5 overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)",
        }}
      />

      {/* Subtle ambient glow based on icon color */}
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-full"
        style={{
          background: `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className="text-slate-500 font-mono uppercase tracking-widest mb-2"
            style={{ fontSize: "10px" }}
          >
            {title}
          </p>
          <h2 className="text-3xl font-bold text-slate-50 leading-none">
            {value}
          </h2>

          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  background: trend.positive
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(239,68,68,0.15)",
                  color: trend.positive ? "#4ade80" : "#f87171",
                }}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-slate-600 text-xs">{trend.label}</span>
            </div>
          )}
        </div>

        <div
          className="p-3 rounded-xl flex-shrink-0"
          style={{
            background: color.bg,
            border: `1px solid ${color.border}`,
          }}
        >
          <div style={{ color: color.icon }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;