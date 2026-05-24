// src/components/coding/AIReviewSidebar.jsx

import { motion } from "framer-motion";

import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bug,
  TimerReset,
  Database,
} from "lucide-react";

const AIReviewSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="
        relative
        overflow-hidden
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-6
        h-full
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Brain className="text-cyan-400" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                AI Review
              </h2>

              <p className="text-sm text-gray-400">
                Smart coding performance analysis
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Powered
          </div>
        </div>

        {/* Complexity Section */}
        <div className="space-y-5 mb-8">
          
          {/* Time Complexity */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
            
            <div className="flex items-center gap-3 mb-4">
              
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <TimerReset
                  className="text-cyan-400"
                  size={22}
                />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  Time Complexity
                </h3>

                <p className="text-xs text-gray-400">
                  Optimized performance analysis
                </p>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-lg text-center">
              O(n)
            </div>
          </div>

          {/* Space Complexity */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
            
            <div className="flex items-center gap-3 mb-4">
              
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Database
                  className="text-purple-400"
                  size={22}
                />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  Space Complexity
                </h3>

                <p className="text-xs text-gray-400">
                  Memory usage estimation
                </p>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-lg text-center">
              O(n)
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mb-8">
          
          <div className="flex items-center gap-3 mb-5">
            
            <TrendingUp
              className="text-green-400"
              size={20}
            />

            <h3 className="text-lg font-semibold text-white">
              AI Suggestions
            </h3>
          </div>

          <div className="space-y-4">
            
            {[
              "Great use of HashMap for optimized lookup.",
              "Variable naming is clean and readable.",
              "Try handling edge cases more explicitly.",
              "Avoid unnecessary nested conditions.",
            ].map((tip, index) => (
              <div
                key={index}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                  text-sm
                  text-gray-300
                  leading-relaxed
                "
              >
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Bug Detection */}
        <div className="mb-8">
          
          <div className="flex items-center gap-3 mb-5">
            
            <Bug className="text-red-400" size={20} />

            <h3 className="text-lg font-semibold text-white">
              Potential Issues
            </h3>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5">
            
            <div className="flex items-start gap-3">
              
              <AlertTriangle
                className="text-red-400 mt-1"
                size={18}
              />

              <p className="text-sm text-gray-300 leading-relaxed">
                Your solution may fail if no valid pair exists.
                Consider adding a fallback return statement
                for better robustness.
              </p>
            </div>
          </div>
        </div>

        {/* AI Score */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-6">
          
          <h3 className="text-lg font-semibold text-white mb-4">
            AI Interview Score
          </h3>

          <div className="flex items-center justify-between">
            
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Overall Performance
              </p>

              <h1 className="text-5xl font-bold text-cyan-400">
                91
              </h1>
            </div>

            <div className="w-28 h-28 rounded-full border-[10px] border-cyan-500/20 flex items-center justify-center">
              
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center">
                
                <Sparkles
                  className="text-cyan-400"
                  size={32}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIReviewSidebar;