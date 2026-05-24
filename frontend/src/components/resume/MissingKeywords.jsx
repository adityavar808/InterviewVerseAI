// src/components/resume/MissingKeywords.jsx

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

const missingKeywords = [
  "Docker",
  "AWS",
  "CI/CD",
  "TypeScript",
  "Redis",
  "Kubernetes",
];

const MissingKeywords = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        
        <div className="flex items-center gap-4">
          
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="text-red-400" size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Missing Keywords
            </h2>

            <p className="text-sm text-gray-400">
              Important ATS keywords missing from your resume
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          <Sparkles size={16} />
          AI Suggestions
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-4 mb-8">
        {missingKeywords.map((keyword, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:border-red-400/40 transition-all duration-300 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Plus size={16} className="text-red-300" />
            </div>

            <span className="text-red-200 font-medium">
              {keyword}
            </span>

            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-red-500/5 to-purple-500/5 transition-all duration-300"></div>
          </motion.div>
        ))}
      </div>

      {/* ATS Recommendation */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
        
        <div className="flex items-start gap-4">
          
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Target className="text-cyan-400" size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              ATS Optimization Tip
            </h3>

            <p className="text-gray-300 leading-relaxed text-sm">
              Adding these keywords naturally inside your project
              descriptions, skills section, and work experience can
              significantly improve ATS ranking for MERN and Full Stack
              Developer roles.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissingKeywords;