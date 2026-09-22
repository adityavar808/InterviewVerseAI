// src/components/analytics/ActivityHeatmap.jsx

import { motion } from "framer-motion";
import { Flame, Sparkles, Calendar } from "lucide-react";

// 20-week (5-month) empty contribution grid
const defaultEmptyWeeks = Array.from({ length: 20 }, () => [0, 0, 0, 0, 0, 0, 0]);

const getColor = (level) => {
  if (level >= 4) return "bg-cyan-300 border-white shadow-[0_0_12px_rgba(34,211,238,0.9)]";
  if (level === 3) return "bg-cyan-400 border-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.7)]";
  if (level === 2) return "bg-cyan-500/80 border-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.5)]";
  if (level === 1) return "bg-cyan-600/70 border-cyan-500/50 shadow-[0_0_4px_rgba(34,211,238,0.3)]";
  return "bg-slate-800/40 border-white/5 hover:border-white/20";
};

// Calculate last 5 month labels dynamically based on current date
const getPastMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString("en-US", { month: "short" }));
  }
  return months;
};

const ActivityHeatmap = ({ data = [], streak = 0 }) => {
  const weeks = data && data.length >= 8 ? data : defaultEmptyWeeks;
  const monthNames = getPastMonths();

  // Divide 20 weeks into 5 distinct month groups (4 weeks per month)
  const monthGroups = monthNames.map((monthName, mIdx) => {
    const startWeek = mIdx * 4;
    const monthWeeks = weeks.slice(startWeek, startWeek + 4);
    while (monthWeeks.length < 4) {
      monthWeeks.push([0, 0, 0, 0, 0, 0, 0]);
    }
    const totalMonthActivity = monthWeeks.flat().reduce((a, b) => a + b, 0);
    return {
      name: monthName,
      weeks: monthWeeks,
      totalActivity: totalMonthActivity,
    };
  });

  // Calculate dynamic stats from the weeks grid
  const totalActivity = weeks.flat().reduce((a, b) => a + b, 0);

  const daySums = [0, 0, 0, 0, 0, 0, 0];
  weeks.forEach((week) => {
    week.forEach((val, idx) => {
      if (idx < 7) daySums[idx] += val;
    });
  });
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxDayIdx = daySums.indexOf(Math.max(...daySums));
  const peakDayName = daySums[maxDayIdx] > 0 ? dayNames[maxDayIdx] : "Sun";

  const activeDays = weeks.flat().filter((v) => v > 0).length;
  const totalDays = weeks.flat().length || 140;
  const consistencyRate = activeDays / totalDays;
  const consistencyLabel =
    consistencyRate > 0.4 ? "Excellent" : consistencyRate > 0.15 ? "Good" : "Needs Work";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }}
        />
      </div>

      <div className="relative">
        {/* Compact Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Flame className="text-cyan-400" size={18} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Activity Heatmap
              </h2>
              <p className="text-[11px] text-slate-400">
                5-Month Monthly Activity Breakdown
              </p>
            </div>
          </div>

          {/* Legend and Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.03] border border-white/10 px-2.5 py-1 rounded-full">
              <span className="text-[10px] text-slate-500 mr-0.5">Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-800/60 border border-white/5" />
              <div className="w-2.5 h-2.5 rounded-sm bg-cyan-600/70" />
              <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500/80" />
              <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              <div className="w-2.5 h-2.5 rounded-sm bg-cyan-300" />
              <span className="text-[10px] text-slate-500 ml-0.5">More</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles size={12} />
              Live Track
            </div>
          </div>
        </div>

        {/* Heatmap Grid Section */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="min-w-[620px]">
            <div className="flex gap-2.5 items-stretch">
              {/* Day Labels Column */}
              <div className="flex flex-col flex-shrink-0 w-7 pt-2">
                <div className="h-6 mb-2 border-b border-transparent" />
                <div className="grid grid-rows-7 gap-1 flex-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayLabel, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-start text-[10px] font-mono text-slate-400 font-semibold leading-none"
                    >
                      {dayLabel}
                    </div>
                  ))}
                </div>
              </div>

              {/* Month Cards Container */}
              <div className="flex-1 grid grid-cols-5 gap-2.5">
                {monthGroups.map((group, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-slate-950/60 border border-white/10 hover:border-cyan-500/40 rounded-xl p-2.5 transition-all duration-200 backdrop-blur-md flex flex-col justify-between group shadow-md"
                  >
                    {/* Month Header Card */}
                    <div className="flex items-center justify-between h-6 mb-2 pb-1.5 border-b border-white/10">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-cyan-400" />
                        <span className="text-[11px] font-bold text-cyan-300 tracking-wider uppercase">
                          {group.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-white/5 border border-white/10 px-1 py-0.5 rounded">
                        {group.totalActivity} act
                      </span>
                    </div>

                    {/* 4-Week Columns */}
                    <div className="grid grid-cols-4 gap-1 flex-1">
                      {group.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="grid grid-rows-7 gap-1">
                          {week.map((day, dIdx) => (
                            <motion.div
                              key={dIdx}
                              whileHover={{ scale: 1.25, zIndex: 30 }}
                              className={`w-full aspect-square rounded-sm border transition-all duration-150 cursor-pointer ${getColor(
                                day
                              )}`}
                              title={`${dayNames[dIdx]}, ${group.name} • Activity level: ${day}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Current Streak
            </p>
            <h3 className="text-cyan-400 font-extrabold text-xs sm:text-sm truncate">
              {streak} Days
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Total Activity
            </p>
            <h3 className="text-emerald-400 font-extrabold text-xs sm:text-sm truncate">
              {totalActivity} Sessions
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Peak Day
            </p>
            <h3 className="text-purple-400 font-extrabold text-xs sm:text-sm truncate">
              {peakDayName}
            </h3>
          </div>

          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-2.5 min-w-0 overflow-hidden hover:bg-white/[0.04] transition-all duration-200">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              Consistency
            </p>
            <h3 className="text-pink-400 font-extrabold text-xs sm:text-sm truncate">
              {consistencyLabel}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;