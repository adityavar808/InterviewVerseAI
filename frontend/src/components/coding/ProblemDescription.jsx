// src/components/coding/ProblemDescription.jsx

import { motion } from "framer-motion";

import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const ProblemDescription = () => {
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
              <BookOpen className="text-cyan-400" size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Problem Description
              </h2>

              <p className="text-sm text-gray-400">
                Solve the coding challenge efficiently
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Guided
          </div>
        </div>

        {/* Problem */}
        <div className="space-y-8">
          
          {/* Statement */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Problem Statement
            </h3>

            <p className="text-gray-300 leading-relaxed">
              Given an array of integers{" "}
              <span className="text-cyan-400 font-medium">
                nums
              </span>{" "}
              and an integer{" "}
              <span className="text-cyan-400 font-medium">
                target
              </span>
              , return indices of the two numbers such that
              they add up to target.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              You may assume that each input would have
              exactly one solution, and you may not use the
              same element twice.
            </p>
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
                  nums[0] + nums[1] == 9
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
              
              {[
                "2 ≤ nums.length ≤ 10⁴",
                "-10⁹ ≤ nums[i] ≤ 10⁹",
                "-10⁹ ≤ target ≤ 10⁹",
                "Only one valid answer exists.",
              ].map((item, index) => (
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
              ))}
            </div>
          </div>

          {/* AI Hint */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
            
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Hint
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed">
              Try solving this problem using a HashMap for
              optimized lookup. Think about reducing the
              brute force time complexity from O(n²) to O(n).
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemDescription;