// src/components/analytics/ActivityHeatmap.jsx

import { motion } from "framer-motion";

import {
  Flame,
  Sparkles,
} from "lucide-react";

const weeks = [
  [1, 2, 0, 4, 3, 2, 1],
  [0, 3, 2, 1, 4, 2, 0],
  [2, 4, 3, 2, 1, 0, 1],
  [1, 2, 4, 3, 2, 1, 2],
  [3, 1, 2, 4, 4, 3, 2],
];

const getColor = (level) => {
  switch (level) {
    case 0:
      return "bg-white/5";
    case 1:
      return "bg-cyan-500/20";
    case 2:
      return "bg-cyan-500/40";
    case 3:
      return "bg-cyan-400/60";
    case 4:
      return "bg-cyan-300";
    default:
      return "bg-white/5";
  }
};

const ActivityHeatmap = () => {
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
              <Flame
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Activity Heatmap
              </h2>

              <p className="text-sm text-gray-400">
                Daily coding & interview consistency tracking
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Live Activity
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          
          <div className="min-w-max">
            
            {/* Month Labels */}
            <div className="flex gap-2 mb-4 pl-10">
              
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
              ].map((month, index) => (
                <div
                  key={index}
                  className="w-[110px] text-sm text-gray-400"
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-2">
              
              {/* Days */}
              <div className="flex flex-col gap-2 mt-1 text-xs text-gray-500">
                
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>

              {/* Grid */}
              <div className="flex gap-2">
                
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-2"
                  >
                    {week.map((day, dayIndex) => (
                      <motion.div
                        key={dayIndex}
                        whileHover={{ scale: 1.15 }}
                        className={`
                          w-7
                          h-7
                          rounded-lg
                          border
                          border-white/5
                          transition-all
                          duration-300
                          ${getColor(day)}
                        `}
                      ></motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Current Streak
            </p>

            <h3 className="text-cyan-400 font-semibold">
              18 Days
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Total Activity
            </p>

            <h3 className="text-green-400 font-semibold">
              248 Sessions
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Peak Day
            </p>

            <h3 className="text-purple-400 font-semibold">
              Thursday
            </h3>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2">
              Consistency
            </p>

            <h3 className="text-pink-400 font-semibold">
              Excellent
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;