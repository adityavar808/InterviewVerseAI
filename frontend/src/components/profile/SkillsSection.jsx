// src/components/profile/SkillsSection.jsx

import { motion } from "framer-motion";

import {
  Code2,
  Sparkles,
  Brain,
  Database,
  Globe,
  Server,
} from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    skills: [
      "React",
      "Tailwind CSS",
      "JavaScript",
      "HTML",
      "CSS",
      "Redux Toolkit",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    skills: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "JWT Auth",
      "MongoDB",
    ],
  },
  {
    title: "AI & ML",
    icon: Brain,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    skills: [
      "Machine Learning",
      "CNN",
      "Whisper AI",
      "MLOps",
      "AI Systems",
    ],
  },
  {
    title: "Database & Tools",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    skills: [
      "MongoDB",
      "Git",
      "GitHub",
      "Postman",
      "Vercel",
      "Render",
    ],
  },
];

const SkillsSection = () => {
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
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Code2
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Skills & Technologies
              </h2>

              <p className="text-sm text-gray-400">
                Technical stack & expertise overview
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Skill Mapping
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {skillCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  ${category.border}
                  ${category.bg}
                  p-5
                `}
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>

                <div className="relative">
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    
                    <div
                      className={`
                        w-14
                        h-14
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${category.bg}
                      `}
                    >
                      <Icon
                        className={category.color}
                        size={26}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {category.title}
                      </h3>

                      <p className="text-xs text-gray-400">
                        Technical Expertise
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-3">
                    
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="
                          px-4
                          py-2
                          rounded-2xl
                          bg-black/20
                          border
                          border-white/10
                          text-sm
                          text-gray-300
                          hover:border-cyan-500/20
                          transition-all
                          duration-300
                        "
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom AI Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Technical Analysis
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your technical stack strongly aligns with modern
            MERN Stack and AI-powered SaaS development roles.
            Continuous DSA practice and advanced backend
            architecture learning can further improve placement
            readiness and technical interview performance.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsSection;