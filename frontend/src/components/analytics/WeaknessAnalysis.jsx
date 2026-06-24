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
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    title: "Communication Confidence",
    issue:
      "Speech confidence slightly drops during technical explanations.",
    improvement: "Practice mock HR interviews regularly.",
    severity: "Medium",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
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
      return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
    case "Medium":
      return { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    case "Low":
      return { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-red-500/[0.06] blur-[50px]" />
        <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full bg-purple-500/[0.06] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.5), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          
          <div className="flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle
                className="text-red-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Weakness Analysis
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                AI-detected improvement areas
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles size={13} />
            AI Detection
          </div>
        </div>

        {/* Weakness Cards */}
        <div className="space-y-4">
          
          {processedWeaknesses.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-4
                hover:bg-white/[0.045]
                transition-all
                duration-300
              "
            >
              <div className="relative">
                
                {/* Top */}
                <div className="flex items-center justify-between mb-4">
                  
                  <div className="flex items-center gap-3">
                    
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
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
                        size={20}
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                        AI Performance Detection
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      px-2.5
                      py-0.5
                      rounded-full
                      text-xs
                      font-semibold
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
                <div className="mb-4">
                  
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.issue}
                  </p>
                </div>

                {/* Improvement */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 mt-4">
                  
                  <div className="flex items-start gap-3">
                    
                    <Brain
                      className="text-cyan-400 mt-0.5 flex-shrink-0"
                      size={16}
                    />

                    <div>
                      <p className="text-xs font-semibold text-white mb-1">
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
        <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
          <div className="relative">
            <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
              AI Coaching Recommendation
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Focus on improving weak technical and communication areas consistently to increase interview success rate and placement readiness.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeaknessAnalysis;