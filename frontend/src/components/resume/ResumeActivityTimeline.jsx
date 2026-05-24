// src/components/resume/ResumeActivityTimeline.jsx

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Upload,
  ScanSearch,
  Brain,
  BadgeCheck,
} from "lucide-react";

const activities = [
  {
    title: "Resume Uploaded",
    description: "Your resume was uploaded successfully.",
    time: "2 min ago",
    icon: Upload,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "ATS Analysis Completed",
    description: "AI generated ATS optimization insights.",
    time: "1 min ago",
    icon: ScanSearch,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Skills Extracted",
    description: "24 technical skills identified.",
    time: "Just now",
    icon: Brain,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    title: "Optimization Score Updated",
    description: "ATS score improved to 82/100.",
    time: "Live",
    icon: BadgeCheck,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

const ResumeActivityTimeline = () => {
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
            <CheckCircle2 className="text-cyan-400" size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Analysis Timeline
            </h2>

            <p className="text-sm text-gray-400">
              Real-time AI resume activity tracking
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          <Sparkles size={16} />
          Live Updates
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
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative flex gap-5"
              >
                {/* Icon */}
                <div
                  className={`
                    relative z-10
                    w-12 h-12
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    ${item.bg}
                    ${item.border}
                  `}
                >
                  <Icon className={item.color} size={22} />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300">
                  
                  <div className="flex items-start justify-between gap-4">
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {item.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeActivityTimeline;