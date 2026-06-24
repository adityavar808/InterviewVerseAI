import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5 cursor-default transition-all duration-300 hover:border-white/20 active:scale-[0.98]"
    >
      {/* Top shimmer line based on accent color */}
      <div
        className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color.icon}, transparent)`,
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
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-white leading-none tracking-tight">
            {value}
          </h2>

          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-lg border"
                style={{
                  background: trend.positive
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.1)",
                  color: trend.positive ? "#4ade80" : "#f87171",
                  borderColor: trend.positive
                    ? "rgba(34,197,94,0.2)"
                    : "rgba(239,68,68,0.2)",
                }}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-slate-500 text-xs font-medium">{trend.label}</span>
            </div>
          )}
        </div>

        <div
          className="p-3 rounded-2xl flex-shrink-0 border"
          style={{
            background: color.bg,
            borderColor: color.border,
          }}
        >
          <div style={{ color: color.icon }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;