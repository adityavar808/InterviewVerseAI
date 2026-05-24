// src/components/profile/CertificatesSection.jsx

import { motion } from "framer-motion";

import {
  Award,
  ExternalLink,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

const certificates = [
  {
    title: "Machine Learning Fundamentals",
    issuer: "Coursera",
    year: "2025",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Frontend Development",
    issuer: "Udemy",
    year: "2025",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "React & Redux Mastery",
    issuer: "Meta",
    year: "2024",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    year: "2024",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const CertificatesSection = () => {
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
              <Award
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Certifications
              </h2>

              <p className="text-sm text-gray-400">
                Professional learning & achievements
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Verified Learning
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {certificates.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className={`
                relative
                overflow-hidden
                rounded-3xl
                border
                ${item.border}
                ${item.bg}
                p-5
              `}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>

              <div className="relative">
                
                {/* Top */}
                <div className="flex items-start justify-between mb-5">
                  
                  <div className="flex items-center gap-4">
                    
                    <div
                      className={`
                        w-14
                        h-14
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${item.bg}
                      `}
                    >
                      <BadgeCheck
                        className={item.color}
                        size={26}
                      />
                    </div>

                    <div>
                      
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {item.issuer}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    {item.year}
                  </div>
                </div>

                {/* Actions */}
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-2xl
                    bg-black/20
                    border
                    border-white/10
                    hover:border-cyan-500/20
                    transition-all
                    duration-300
                    text-sm
                    text-gray-300
                  "
                >
                  <ExternalLink size={16} />

                  View Certificate
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Learning Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your certifications demonstrate strong commitment
            toward continuous learning in frontend development,
            AI systems, full stack engineering, and problem
            solving which positively impacts placement readiness.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificatesSection;