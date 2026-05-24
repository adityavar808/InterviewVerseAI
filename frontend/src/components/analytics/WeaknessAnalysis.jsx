// src/components/analytics/WeaknessAnalysis.jsx

import { motion } from "framer-motion";

import {
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Brain,
} from "lucide-react";

const weaknesses = [
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

const WeaknessAnalysis = () => {
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
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle
                className="text-red-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Weakness Analysis
              </h2>

              <p className="text-sm text-gray-400">
                AI-detected improvement areas
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Detection
          </div>
        </div>

        {/* Weakness Cards */}
        <div className="space-y-5">
          
          {weaknesses.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              className={`
                relative
                overflow-hidden
                rounded-3xl
                border
                ${item.border}
                ${item.bg}
                p-5
              `}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>

              <div className="relative">
                
                {/* Top */}
                <div className="flex items-center justify-between mb-5">
                  
                  <div className="flex items-center gap-3">
                    
                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${item.bg}
                      `}
                    >
                      <TrendingDown
                        className={item.color}
                        size={22}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-400">
                        AI Performance Detection
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      px-4
                      py-1
                      rounded-full
                      text-xs
                      font-medium
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
                <div className="mb-5">
                  
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.issue}
                  </p>
                </div>

                {/* Improvement */}
                <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                  
                  <div className="flex items-start gap-3">
                    
                    <Brain
                      className="text-cyan-400 mt-1"
                      size={18}
                    />

                    <div>
                      <p className="text-sm font-medium text-white mb-1">
                        Recommended Improvement
                      </p>

                      <p className="text-sm text-gray-400">
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
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Coaching Recommendation
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Focus on improving weak technical and communication
            areas consistently to increase interview success rate
            and placement readiness.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeaknessAnalysis;