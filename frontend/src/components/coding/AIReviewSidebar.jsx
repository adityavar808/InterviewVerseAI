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

const AIReviewSidebar = ({ aiReview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl h-full flex flex-col"
    >
      {/* Background glow and top gradient line */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-purple-500/[0.04] blur-[50px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.45), rgba(139,92,246,0.25), transparent)",
          }}
        />
      </div>

      {/* Sticky Header */}
      <div className="relative z-10 flex items-center justify-between p-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Brain className="text-cyan-400" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">
              AI Review
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Smart performance analysis
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={13} className="text-purple-400" />
          AI Powered
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 custom-scrollbar-hide min-h-0 space-y-7">
        {!aiReview ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Sparkles className="text-cyan-400 animate-pulse" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">No Active Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[260px]">
                Submit your solution to execute the automated judge server. AI will evaluate time/space complexity, optimize code loops, and verify boundary cases.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Complexity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time Complexity */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <TimerReset className="text-cyan-400" size={18} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-xs leading-none">
                      Time Complexity
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-1">
                      Speed performance
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-base text-center font-bold">
                  {aiReview.timeComplexity || "O(n)"}
                </div>
              </div>

              {/* Space Complexity */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Database className="text-purple-400" size={18} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-xs leading-none">
                      Space Complexity
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-1">
                      Memory usage
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-base text-center font-bold">
                  {aiReview.spaceComplexity || "O(1)"}
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            {aiReview.tips && aiReview.tips.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-green-400" size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Optimization Suggestions
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {aiReview.tips.map((tip, index) => (
                    <div
                      key={index}
                      className="bg-white/[0.025] border border-white/10 rounded-xl p-3.5 text-xs text-gray-300 leading-relaxed hover:bg-white/[0.04] transition-all duration-200"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bug Detection */}
            {aiReview.issues && aiReview.issues.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bug className="text-rose-400" size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Potential Bottlenecks
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {aiReview.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-4 hover:bg-rose-500/[0.06] transition-all duration-300 flex items-start gap-3"
                    >
                      <AlertTriangle className="text-rose-400 flex-shrink-0 mt-0.5" size={15} />
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {issue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Score */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 hover:bg-cyan-500/[0.06] transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3.5">
                AI Evaluation Score
              </h3>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                    Overall Rating
                  </p>
                  <h1 className="text-4xl font-extrabold text-cyan-400 tracking-tight">
                    {aiReview.score || 85} / 100
                  </h1>
                </div>

                <div className="w-20 h-20 rounded-full border-8 border-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Sparkles className="text-cyan-400 animate-pulse" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AIReviewSidebar;