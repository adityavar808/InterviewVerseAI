// src/components/profile/ProfileAboutCard.jsx

import { motion } from "framer-motion";

import {
  User,
  GraduationCap,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

const ProfileAboutCard = () => {
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
              <User
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                About Profile
              </h2>

              <p className="text-sm text-gray-400">
                Personal & career overview
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Profile
          </div>
        </div>

        {/* About Content */}
        <div className="space-y-6">
          
          {/* Bio */}
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
            
            <h3 className="text-lg font-semibold text-white mb-3">
              Bio
            </h3>

            <p className="text-gray-300 leading-relaxed">
              Passionate full stack developer and AI enthusiast
              focused on building scalable SaaS platforms,
              interview preparation systems, and modern web
              applications using MERN Stack and AI-powered
              technologies.
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Education */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              
              <div className="flex items-center gap-3 mb-4">
                
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <GraduationCap
                    className="text-cyan-400"
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="text-white font-semibold">
                    Education
                  </h3>

                  <p className="text-xs text-gray-400">
                    Academic Background
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                B.Tech in Computer Science & Engineering
                with specialization in AIML & IoT.
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              
              <div className="flex items-center gap-3 mb-4">
                
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <BriefcaseBusiness
                    className="text-purple-400"
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="text-white font-semibold">
                    Experience
                  </h3>

                  <p className="text-xs text-gray-400">
                    Career Journey
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                Building modern AI-powered SaaS projects,
                coding interview systems, and full stack
                applications using React and Node.js.
              </p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
            
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Career Summary
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed">
              Your profile indicates strong growth in full stack
              development, coding interviews, and AI product
              building. Consistent interview practice and project
              development are significantly improving placement
              readiness.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileAboutCard;