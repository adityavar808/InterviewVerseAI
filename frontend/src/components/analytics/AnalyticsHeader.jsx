// src/components/analytics/AnalyticsHeader.jsx

import { motion } from "framer-motion";

import {
  BarChart3,
  CalendarDays,
  Download,
  Sparkles,
} from "lucide-react";

const AnalyticsHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
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

      <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        
        {/* Left */}
        <div>
          
          <div className="flex items-center gap-4 mb-4">
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <BarChart3
                className="text-cyan-400"
                size={24}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Analytics Dashboard
              </h1>

              <p className="text-slate-400 text-sm mt-0.5">
                AI-powered interview performance insights
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2.5">
            
            <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
              Live Analytics
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              AI Tracking
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-medium">
              Performance Insights
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          
          {/* Date Filter */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all duration-300 cursor-default">
            
            <CalendarDays
              className="text-cyan-400"
              size={18}
            />

            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                Time Range
              </p>

              <h3 className="text-white text-sm font-medium">
                Last 30 Days
              </h3>
            </div>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
            
            <Sparkles size={16} />

            <span>
              AI Insights Enabled
            </span>
          </div>

          {/* Export Button */}
          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-2.5
              rounded-2xl
              bg-cyan-400
              hover:bg-cyan-300
              text-slate-950
              font-semibold
              text-sm
              shadow-[0_0_20px_rgba(34,211,238,0.25)]
              hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]
              active:scale-[0.98]
              transition-all
              duration-300
              cursor-pointer
            "
          >
            <Download size={16} />

            Export Report
          </button>
        </div>
      </div>

      {/* Bottom AI Note */}
      <div className="relative mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
        {/* Inner subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.04] to-purple-500/[0.04] rounded-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          
          <Sparkles
            className="text-cyan-400 mt-0.5 flex-shrink-0"
            size={16}
          />

          <p className="text-sm text-slate-300 leading-relaxed">
            Your analytics dashboard tracks interview performance, coding accuracy, communication skills, and AI-generated improvement trends in real time.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;