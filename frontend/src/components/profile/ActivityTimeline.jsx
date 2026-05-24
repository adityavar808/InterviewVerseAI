// src/components/profile/ActivityTimeline.jsx

import { motion } from "framer-motion";

import {
  Clock3,
  FileText,
  Code2,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const activities = [
  {
    title: "Completed Frontend Interview",
    description:
      "Successfully completed AI-powered frontend interview simulation.",
    time: "2 Hours Ago",
    icon: Brain,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Solved Coding Challenge",
    description:
      "Completed medium-level DSA problem with optimized solution.",
    time: "5 Hours Ago",
    icon: Code2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Resume Updated",
    description:
      "Uploaded updated ATS-optimized resume with AI recommendations.",
    time: "Yesterday",
    icon: FileText,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Performance Improved",
    description:
      "AI detected improvement in communication and coding accuracy.",
    time: "2 Days Ago",
    icon: CheckCircle2,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const ActivityTimeline = () => {
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
              <Clock3
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Activity Timeline
              </h2>

              <p className="text-sm text-gray-400">
                Recent learning & interview activities
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Live Tracking
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          
          {/* Vertical Line */}
          <div className="absolute top-0 left-6 w-[2px] h-full bg-gradient-to-b from-cyan-500/30 via-purple-500/20 to-transparent"></div>

          <div className="space-y-8">
            
            {activities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-5"
                >
                  {/* Icon */}
                  <div
                    className={`
                      relative
                      z-10
                      w-12
                      h-12
                      rounded-2xl
                      border
                      flex
                      items-center
                      justify-center
                      ${item.bg}
                      ${item.border}
                    `}
                  >
                    <Icon
                      className={item.color}
                      size={22}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5 hover:border-cyan-500/20 transition-all duration-300">
                    
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      
                      <div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="px-4 py-2 rounded-2xl bg-black/20 border border-white/10 text-xs text-gray-400 w-fit">
                        {item.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Activity Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your recent activities indicate strong consistency
            in coding practice, interview preparation, and
            profile optimization. Maintaining this learning
            momentum will significantly improve placement
            performance.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;