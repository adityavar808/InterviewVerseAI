// src/components/profile/AchievementsSection.jsx

import { motion } from "framer-motion";

import {
  Trophy,
  Medal,
  Flame,
  Star,
  Sparkles,
} from "lucide-react";

const achievements = [
  {
    title: "100 Coding Problems Solved",
    description:
      "Successfully solved over 100 DSA and interview-level problems.",
    icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    title: "Top 10% Performer",
    description:
      "Ranked among the top-performing candidates in AI interview simulations.",
    icon: Medal,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "18 Day Streak",
    description:
      "Maintained continuous interview preparation and coding consistency.",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    title: "AI Resume Optimized",
    description:
      "Achieved strong ATS resume score with AI-powered recommendations.",
    icon: Star,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const AchievementsSection = () => {
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
            
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Trophy
                className="text-yellow-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Achievements
              </h2>

              <p className="text-sm text-gray-400">
                Milestones & interview accomplishments
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Career Progress
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {achievements.map((item, index) => {
            const Icon = item.icon;

            return (
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

                <div className="relative flex gap-5">
                  
                  {/* Icon */}
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      shrink-0
                      ${item.bg}
                    `}
                  >
                    <Icon
                      className={item.color}
                      size={26}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Achievement Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your consistent coding practice, interview
            preparation, and AI-driven learning approach are
            significantly strengthening your technical profile
            and placement readiness.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsSection;