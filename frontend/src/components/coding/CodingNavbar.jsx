// src/components/coding/CodingNavbar.jsx

import { motion } from "framer-motion";

import { Clock3, Play, Send, Code2, Sparkles } from "lucide-react";

const CodingNavbar = ({ question }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative
        overflow-hidden
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-5
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Code2 className="text-cyan-400" size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                {question?.title || "Coding Problem"}
              </h1>

              <p className="text-sm text-gray-400">{question?.category}</p>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-wrap gap-3">
            <div
              className={`
    px-4 py-1 rounded-full border text-sm font-medium
    ${
      question?.difficulty === "Easy"
        ? "bg-green-500/10 border-green-500/20 text-green-400"
        : question?.difficulty === "Medium"
          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
          : "bg-red-500/10 border-red-500/20 text-red-400"
    }
  `}
            >
              {question?.difficulty}
            </div>

            <div className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
              AI Assisted
            </div>

            <div className="px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
              Interview Mode
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
            <Clock3 className="text-cyan-400" size={20} />

            <div>
              <p className="text-xs text-gray-400">Time Remaining</p>

              <h3 className="text-white font-semibold">42:18</h3>
            </div>
          </div>

          {/* Language */}
          <select
            className="
              bg-[#111827]
              border
              border-white/10
              hover:border-cyan-500/30
              rounded-2xl
              px-4
              py-3
              text-white
              outline-none
              transition-all
              duration-300
            "
            defaultValue="javascript"
          >
            <option value="javascript">JavaScript</option>

            <option value="python">Python</option>

            <option value="cpp">C++</option>

            <option value="java">Java</option>
          </select>

          {/* Run Button */}
          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-white/5
              border
              border-white/10
              hover:border-cyan-500/30
              hover:bg-cyan-500/10
              transition-all
              duration-300
              text-white
            "
          >
            <Play size={18} />
            Run
          </button>

          {/* Submit Button */}
          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-2xl
              bg-cyan-500
              hover:bg-cyan-400
              transition-all
              duration-300
              text-white
              font-medium
            "
          >
            <Send size={18} />
            Submit
          </button>
        </div>
      </div>

      {/* Bottom AI Note */}
      <div className="relative mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="text-cyan-400 mt-1" size={18} />

          <p className="text-sm text-gray-300 leading-relaxed">
            AI interviewer will analyze your solution, optimization approach,
            coding style, and time complexity after submission.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CodingNavbar;
