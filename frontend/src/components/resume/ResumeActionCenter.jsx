// src/components/resume/ResumeActionCenter.jsx

import { motion } from "framer-motion";
import {
  Download,
  RefreshCcw,
  Share2,
  FileSpreadsheet,
  Sparkles,
  Wand2,
} from "lucide-react";

const actions = [
  {
    title: "Reanalyze Resume",
    description:
      "Run the AI analysis again with updated ATS insights.",
    icon: RefreshCcw,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Download Report",
    description:
      "Export detailed ATS analysis and improvement report.",
    icon: Download,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Share Resume",
    description:
      "Generate a public shareable resume review link.",
    icon: Share2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Export PDF",
    description:
      "Download AI-enhanced ATS optimized resume PDF.",
    icon: FileSpreadsheet,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const ResumeActionCenter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        
        <div className="flex items-center gap-4">
          
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Wand2 className="text-cyan-400" size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Action Center
            </h2>

            <p className="text-sm text-gray-400">
              Smart resume tools & AI-powered actions
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          <Sparkles size={16} />
          Productivity Tools
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {actions.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={index}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative
                overflow-hidden
                text-left
                rounded-3xl
                border
                ${item.border}
                ${item.bg}
                p-5
                transition-all
                duration-300
                hover:border-cyan-500/30
              `}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>

              <div className="relative">
                
                {/* Icon */}
                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    mb-5
                    ${item.bg}
                  `}
                >
                  <Icon className={item.color} size={26} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
        
        <h3 className="text-lg font-semibold text-white mb-2">
          Smart AI Resume Optimization
        </h3>

        <p className="text-sm text-gray-300 leading-relaxed">
          Use these tools to continuously improve your resume,
          optimize ATS ranking, and prepare for modern placement
          opportunities with AI-powered recommendations.
        </p>
      </div>
    </motion.div>
  );
};

export default ResumeActionCenter;