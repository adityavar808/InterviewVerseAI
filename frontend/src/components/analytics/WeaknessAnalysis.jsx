// src/components/analytics/WeaknessAnalysis.jsx

import { motion } from "framer-motion";

import {
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Brain,
} from "lucide-react";

const defaultWeaknesses = [
  {
    title: "System Design",
    issue:
      "Need stronger understanding of scalable architecture patterns and distributed systems.",
    improvement: "Focus on HLD & LLD practice.",
    severity: "High",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    title: "Communication Confidence",
    issue:
      "Speech confidence slightly drops during technical explanations.",
    improvement: "Practice mock HR interviews regularly.",
    severity: "Medium",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    title: "Code Optimization",
    issue:
      "Some solutions use unnecessary loops and redundant conditions.",
    improvement: "Focus on time complexity optimization.",
    severity: "Medium",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const getSeverityStyles = (severity) => {
  switch(severity) {
    case "High":
      return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    case "Medium":
      return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    case "Low":
      return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    default:
      return { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
  }
};

const WeaknessAnalysis = ({ weaknesses = defaultWeaknesses }) => {
  const displayWeaknesses = weaknesses && weaknesses.length > 0 ? weaknesses : defaultWeaknesses;
  
  const processedWeaknesses = displayWeaknesses.map(w => ({
    ...w,
    ...(w.severity ? getSeverityStyles(w.severity) : getSeverityStyles("Medium"))
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-rose-500/10 blur-[40px]" />
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(244,63,94,0.6), rgba(167,139,250,0.4), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4 relative">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <AlertTriangle
                className="text-rose-400"
                size={18}
              />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Weakness Analysis
              </h2>
              <p className="text-[11px] text-slate-400">
                AI-detected improvement areas
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            AI Detection
          </div>
        </div>

        {/* Weakness Cards */}
        <div className="space-y-3">
          
          {processedWeaknesses.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-white/10
                bg-white/[0.025]
                p-3.5
                hover:bg-white/[0.04]
                transition-all
                duration-200
              "
            >
              <div className="relative">
                
                {/* Top */}
                <div className="flex items-center justify-between mb-2">
                  
                  <div className="flex items-center gap-2.5">
                    
                    <div
                      className={`
                        w-8
                        h-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        border
                        bg-white/[0.04]
                        border-white/10
                      `}
                    >
                      <TrendingDown
                        className={item.color}
                        size={16}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium">
                        AI Performance Detection
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      px-2.5
                      py-0.5
                      rounded-full
                      text-[10px]
                      font-bold
                      ${item.bg}
                      ${item.border}
                      border
                      ${item.color}
                    `}
                  >
                    {item.severity}
                  </div>
                </div>

                {/* Issue */}
                <div className="mb-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.issue}
                  </p>
                </div>

                {/* Improvement */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <Brain
                      className="text-cyan-400 mt-0.5 flex-shrink-0"
                      size={14}
                    />
                    <div>
                      <p className="text-[11px] font-bold text-white mb-0.5">
                        Recommended Improvement
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.improvement}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-4 bg-white/[0.025] border border-white/10 rounded-xl p-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
          <div className="relative">
            <h3 className="text-xs font-bold text-white mb-0.5 tracking-tight">
              AI Coaching Recommendation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Focus on improving weak technical and communication areas consistently to increase interview success rate and placement readiness.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeaknessAnalysis;