// src/components/coding/TestCasePanel.jsx

import { motion } from "framer-motion";

import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const TestCasePanel = ({ testCases = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FlaskConical className="text-cyan-400" size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white leading-none">
              Test Cases
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Validate your solution against sample tests
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-semibold uppercase tracking-wider">
          <Sparkles size={12} className="text-purple-400" />
          Smart Testing
        </div>
      </div>

      {/* Scrollable Body Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 custom-scrollbar-hide min-h-0 space-y-4">
        {testCases.map((test, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -1 }}
            className="relative overflow-hidden bg-white/[0.03] border border-white/10 hover:border-cyan-500/20 transition-all duration-300 rounded-2xl p-4"
          >
            {/* Status Glow */}
            <div
              className={`absolute inset-0 opacity-[0.02] pointer-events-none ${
                test.status === "passed" ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <div className="relative">
              {/* Card Top */}
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-xs font-semibold text-white">
                  Test Case {index + 1}
                </h3>

                {test.status === "passed" ? (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-semibold uppercase tracking-wider">
                    <CheckCircle2 size={10} />
                    Passed
                  </div>
                ) : test.status === "failed" ? (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-semibold uppercase tracking-wider">
                    <XCircle size={10} />
                    Failed
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[9px] font-semibold uppercase tracking-wider">
                    Pending
                  </div>
                )}
              </div>

              {/* Inputs/Outputs grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Input */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Input
                  </p>
                  <div className="bg-white/[0.015] border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono overflow-x-auto custom-scrollbar-hide">
                    {test.input}
                  </div>
                </div>

                {/* Expected Output */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Expected
                  </p>
                  <div className="bg-white/[0.015] border border-white/10 rounded-xl px-3 py-2 text-xs text-green-300 font-mono overflow-x-auto custom-scrollbar-hide">
                    {test.expectedOutput || test.output}
                  </div>
                </div>

                {/* Actual Output */}
                {test.status && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Actual
                    </p>
                    <div className={`bg-white/[0.015] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono overflow-x-auto custom-scrollbar-hide ${
                      test.status === "passed" ? "text-cyan-300" : "text-rose-400"
                    }`}>
                      {test.actualOutput || (test.status === "passed" ? "Pass" : "None")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Bottom AI Note inside scroll area */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 hover:bg-cyan-500/[0.06] transition-all duration-300">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1">
            AI Execution Analysis
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Your solution will be tested against hidden edge cases, performance
            benchmarks, and optimization checks during AI evaluation.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestCasePanel;