// src/components/resume/ResumeImprovementRoadmap.jsx

import { motion } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const roadmapSteps = [
  {
    title: "Add Cloud Technologies",
    description:
      "Include AWS, Docker, and CI/CD skills to improve ATS matching for modern full stack roles.",
    status: "High Impact",
  },
  {
    title: "Improve Project Descriptions",
    description:
      "Add measurable achievements, performance improvements, and real-world impact metrics.",
    status: "Recommended",
  },
  {
    title: "Optimize Resume Keywords",
    description:
      "Use role-specific keywords naturally inside projects, skills, and experience sections.",
    status: "Important",
  },
  {
    title: "Add Deployment Experience",
    description:
      "Mention platforms like Vercel, Render, Netlify, and cloud deployment workflows.",
    status: "Boost ATS",
  },
];

const ResumeImprovementRoadmap = () => {
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
            <Rocket className="text-cyan-400" size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Improvement Roadmap
            </h2>

            <p className="text-sm text-gray-400">
              AI-generated steps to improve your resume
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          <Sparkles size={16} />
          AI Coach
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        
        {roadmapSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12 }}
            whileHover={{ y: -3 }}
            className="relative bg-white/5 border border-white/10 hover:border-cyan-500/20 transition-all duration-300 rounded-3xl p-5 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>

            <div className="relative flex gap-5">
              
              {/* Step Icon */}
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2
                  className="text-cyan-400"
                  size={24}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
                  
                  <h3 className="text-lg font-semibold text-white">
                    {step.title}
                  </h3>

                  <div className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs w-fit">
                    {step.status}
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Action */}
                <button className="mt-5 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 text-sm font-medium">
                  Improve Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
        
        <h3 className="text-lg font-semibold text-white mb-2">
          AI Resume Coaching
        </h3>

        <p className="text-sm text-gray-300 leading-relaxed">
          Following these recommendations can significantly increase
          your ATS score, improve recruiter visibility, and strengthen
          your placement opportunities for modern software engineering
          roles.
        </p>
      </div>
    </motion.div>
  );
};

export default ResumeImprovementRoadmap;