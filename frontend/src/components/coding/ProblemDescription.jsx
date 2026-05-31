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
              <BookOpen
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Problem Description
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Understand the problem before coding
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Guided
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Problem Statement */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Problem Statement
            </h3>

            <div className="space-y-4">
              {question?.description ? (
                question.description
                  .split("\n")
                  .filter(Boolean)
                  .map((para, index) => (
                    <p
                      key={index}
                      className="text-gray-300 leading-7"
                    >
                      {para}
                    </p>
                  ))
              ) : (
                <p className="text-slate-500">
                  No problem description available.
                </p>
              )}
            </div>
          </div>

          {/* Example */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">
              Example
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-cyan-400 font-medium">
                  Input:
                </span>

                <span className="text-gray-300 ml-2">
                  nums = [2,7,11,15], target = 9
                </span>
              </div>

              <div>
                <span className="text-green-400 font-medium">
                  Output:
                </span>

                <span className="text-gray-300 ml-2">
                  [0,1]
                </span>
              </div>

              <div>
                <span className="text-purple-400 font-medium">
                  Explanation:
                </span>

                <span className="text-gray-300 ml-2">
                  nums[0] + nums[1] = 9
                </span>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle
                className="text-yellow-400"
                size={20}
              />

              <h3 className="text-lg font-semibold text-white">
                Constraints
              </h3>
            </div>

            <div className="space-y-3">
              {question?.constraints ? (
                question.constraints
                  .split("\n")
                  .filter(Boolean)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="
                        flex
                        items-center
                        gap-3
                        bg-white/5
                        border
                        border-white/10
                        rounded-2xl
                        px-4
                        py-3
                      "
                    >
                      <CheckCircle2
                        className="text-green-400"
                        size={18}
                      />

                      <p className="text-gray-300 text-sm">
                        {item}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm text-slate-500">
                    No constraints available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Hint */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Hint
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed">
              Break the problem into smaller steps.
              Focus on time complexity and edge cases
              before implementing the final solution.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemDescription;