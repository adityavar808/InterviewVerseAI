// src/components/analytics/ActivityHeatmap.jsx

import { motion } from "framer-motion";

import {
  Flame,
  Sparkles,
} from "lucide-react";

const defaultWeeks = [
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

const ActivityHeatmap = ({ data = defaultWeeks, streak = 0 }) => {
  const weeks = data && data.length > 0 ? data : defaultWeeks;

  // Calculate dynamic stats from the weeks grid
  const totalActivity = weeks.flat().reduce((a, b) => a + b, 0);

  const daySums = [0, 0, 0, 0, 0, 0, 0];
  weeks.forEach((week) => {
    week.forEach((val, idx) => {
      if (idx < 7) daySums[idx] += val;
    });
  });
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const maxDayIdx = daySums.indexOf(Math.max(...daySums));
  const peakDayName = daySums[maxDayIdx] > 0 ? dayNames[maxDayIdx] : "None";

  const activeDays = weeks.flat().filter(v => v > 0).length;
  const totalDays = weeks.flat().length || 35;
  const consistencyRate = activeDays / totalDays;
  const consistencyLabel = consistencyRate > 0.4 ? "Excellent" : consistencyRate > 0.15 ? "Good" : "Needs Work";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
        <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full bg-purple-500/[0.06] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          
          <div className="flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Flame
                className="text-cyan-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Activity Heatmap
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Daily coding & interview consistency tracking
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles size={13} />
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
                  className="w-[110px] text-sm text-slate-400"
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-2">
              
              {/* Days */}
              <div className="flex flex-col gap-2 mt-1 text-xs text-slate-500">
                
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
                          border-white/10
                          hover:border-cyan-400/30
                          hover:shadow-[0_0_8px_rgba(34,211,238,0.3)]
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
          
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Current Streak
            </p>

            <h3 className="text-cyan-400 font-semibold">
              {streak} Days
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Total Activity
            </p>

            <h3 className="text-green-400 font-semibold">
              {totalActivity} Sessions
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Peak Day
            </p>

            <h3 className="text-purple-400 font-semibold">
              {peakDayName}
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.045] transition-all duration-300">
            <p className="text-xs text-slate-400 mb-1.5">
              Consistency
            </p>

            <h3 className="text-pink-400 font-semibold">
              {consistencyLabel}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;