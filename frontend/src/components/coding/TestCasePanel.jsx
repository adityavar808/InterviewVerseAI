// src/components/coding/TestCasePanel.jsx

import { motion } from "framer-motion";

import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const testCases = [
  {
    input: "nums = [2,7,11,15], target = 9",
    output: "[0,1]",
    status: "passed",
  },
  {
    input: "nums = [3,2,4], target = 6",
    output: "[1,2]",
    status: "passed",
  },
  {
    input: "nums = [3,3], target = 6",
    output: "[0,1]",
    status: "failed",
  },
];

const TestCasePanel = () => {
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
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FlaskConical
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Test Cases
              </h2>

              <p className="text-sm text-gray-400">
                Validate your solution against sample tests
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Smart Testing
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-5">
          
          {testCases.map((test, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              className="
                relative
                overflow-hidden
                bg-[#111827]
                border
                border-white/10
                hover:border-cyan-500/20
                transition-all
                duration-300
                rounded-3xl
                p-5
              "
            >
              {/* Status Glow */}
              <div
                className={`
                  absolute
                  inset-0
                  opacity-5
                  ${
                    test.status === "passed"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                `}
              ></div>

              <div className="relative">
                
                {/* Top */}
                <div className="flex items-center justify-between mb-5">
                  
                  <h3 className="text-lg font-semibold text-white">
                    Test Case {index + 1}
                  </h3>

                  {test.status === "passed" ? (
                    <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      <CheckCircle2 size={16} />
                      Passed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <XCircle size={16} />
                      Failed
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  
                  {/* Input */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      Input
                    </p>

                    <div className="bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-sm text-cyan-300 font-mono overflow-x-auto">
                      {test.input}
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      Expected Output
                    </p>

                    <div className="bg-black/30 border border-white/10 rounded-2xl px-4 py-3 text-sm text-green-300 font-mono overflow-x-auto">
                      {test.output}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom AI Note */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Execution Analysis
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your solution will be tested against hidden edge
            cases, performance benchmarks, and optimization
            checks during AI-powered evaluation.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestCasePanel;