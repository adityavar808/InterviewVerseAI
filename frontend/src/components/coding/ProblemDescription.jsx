import { motion } from "framer-motion";

import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const ProblemDescription = ({ question }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
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
            <BookOpen className="text-cyan-400" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">
              Problem Description
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Understand the problem details
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={13} className="text-purple-400" />
          AI Guided
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 custom-scrollbar-hide min-h-0 space-y-7">
        {/* Problem Statement */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3.5">
            Problem Statement
          </h3>

          <div className="space-y-4">
            {question?.description ? (
              <div
                className="problem-description-content"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />
            ) : (
              <p className="text-slate-500 italic text-sm">
                No problem description available.
              </p>
            )}
          </div>
        </div>

        {(() => {
          const meta = title => {
            const t = title?.toLowerCase() || "";
            if (t.includes("trap") || t.includes("rain") || t.includes("water")) {
              return {
                input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                output: "6",
                explanation: "The elevation map is represented by [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.",
                hint: "Use two pointers (left and right) moving towards each other, maintaining left_max and right_max to calculate the water trapped at each index in O(n) time and O(1) space."
              };
            }
            return {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "nums[0] + nums[1] = 2 + 7 = 9 (indices 0 and 1 are returned).",
              hint: "Identify if you can store previously visited elements to avoid a nested loop. Think about a Map or Set to reduce complexity to O(n) in a single pass."
            };
          };
          const qMeta = meta(question?.title);
          return (
            <>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                  Example Scenario
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-cyan-400 font-semibold uppercase tracking-wider">
                      Input:
                    </span>
                    <span className="text-slate-300 ml-2">{qMeta.input}</span>
                  </div>

                  <div>
                    <span className="text-green-400 font-semibold uppercase tracking-wider">
                      Output:
                    </span>
                    <span className="text-slate-300 ml-2">{qMeta.output}</span>
                  </div>

                  <div className="pt-1 border-t border-white/5">
                    <span className="text-purple-400 font-semibold uppercase tracking-wider">
                      Explanation:
                    </span>
                    <span className="text-slate-400 ml-2">{qMeta.explanation}</span>
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <AlertTriangle className="text-yellow-500/80" size={16} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Constraints
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {question?.constraints ? (
                    question.constraints
                      .split("\n")
                      .filter(Boolean)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 hover:bg-white/[0.04] transition-all duration-200"
                        >
                          <CheckCircle2 className="text-green-400/80" size={15} />
                          <p className="text-gray-300 text-xs font-mono">{item}</p>
                        </div>
                      ))
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-slate-500 italic">
                        No constraints specified.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Hint */}
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 hover:bg-cyan-500/[0.06] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-cyan-400" size={16} />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    AI Hint
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {qMeta.hint}
                </p>
              </div>
            </>
          );
        })()}
      </div>
    </motion.div>
  );
};

export default ProblemDescription;