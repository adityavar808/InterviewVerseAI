// src/components/resume/TargetRoleSelector.jsx

import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const roles = [
  "MERN Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Machine Learning Engineer",
  "Data Analyst",
  "DevOps Engineer",
];

const TargetRoleSelector = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        
        <div className="flex items-center gap-4">
          
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BriefcaseBusiness
              className="text-cyan-400"
              size={26}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Target Job Role
            </h2>

            <p className="text-sm text-gray-400">
              Customize ATS analysis for specific roles
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          <Sparkles size={16} />
          Smart Matching
        </div>
      </div>

      {/* Selector */}
      <div className="relative">
        
        <select
          className="
            w-full
            appearance-none
            bg-[#111827]
            border border-white/10
            hover:border-cyan-500/30
            focus:border-cyan-500/50
            outline-none
            transition-all
            duration-300
            rounded-2xl
            px-5
            py-4
            text-white
            text-lg
            cursor-pointer
          "
          defaultValue="MERN Developer"
        >
          {roles.map((role, index) => (
            <option
              key={index}
              value={role}
              className="bg-[#111827]"
            >
              {role}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <div className="absolute top-1/2 right-5 -translate-y-1/2 pointer-events-none">
          <ChevronDown
            className="text-gray-400"
            size={22}
          />
        </div>
      </div>

      {/* Suggested Roles */}
      <div className="mt-8">
        
        <h3 className="text-sm text-gray-400 mb-4">
          Recommended Roles
        </h3>

        <div className="flex flex-wrap gap-3">
          
          {[
            "AI Engineer",
            "React Developer",
            "Software Engineer",
            "Cloud Engineer",
          ].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              className="
                px-4
                py-2
                rounded-xl
                bg-white/5
                border
                border-white/10
                hover:border-cyan-500/30
                hover:bg-cyan-500/10
                transition-all
                duration-300
                text-sm
                text-gray-300
              "
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4">
        
        <p className="text-sm text-gray-300 leading-relaxed">
          Selecting a target role helps the AI compare your resume
          against industry-relevant skills, keywords, and ATS
          expectations for better optimization insights.
        </p>
      </div>
    </motion.div>
  );
};

export default TargetRoleSelector;