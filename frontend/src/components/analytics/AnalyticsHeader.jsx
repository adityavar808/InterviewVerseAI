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
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        
        {/* Left */}
        <div>
          
          <div className="flex items-center gap-4 mb-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <BarChart3
                className="text-cyan-400"
                size={28}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                Analytics Dashboard
              </h1>

              <p className="text-gray-400 mt-1">
                AI-powered interview performance insights
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            
            <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
              Live Analytics
            </div>

            <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
              AI Tracking
            </div>

            <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
              Performance Insights
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          
          {/* Date Filter */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
            
            <CalendarDays
              className="text-cyan-400"
              size={20}
            />

            <div>
              <p className="text-xs text-gray-400">
                Time Range
              </p>

              <h3 className="text-white font-medium">
                Last 30 Days
              </h3>
            </div>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
            
            <Sparkles size={18} />

            <span className="font-medium">
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
              px-6
              py-3
              rounded-2xl
              bg-cyan-500
              hover:bg-cyan-400
              transition-all
              duration-300
              text-white
              font-medium
            "
          >
            <Download size={18} />

            Export Report
          </button>
        </div>
      </div>

      {/* Bottom AI Note */}
      <div className="relative mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4">
        
        <div className="flex items-start gap-3">
          
          <Sparkles
            className="text-cyan-400 mt-1"
            size={18}
          />

          <p className="text-sm text-gray-300 leading-relaxed">
            Your analytics dashboard tracks interview
            performance, coding accuracy, communication
            skills, and AI-generated improvement trends
            in real time.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;