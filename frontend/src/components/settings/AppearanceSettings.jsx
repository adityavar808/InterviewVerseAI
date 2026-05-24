// src/components/settings/AppearanceSettings.jsx

import { motion } from "framer-motion";

import {
  Palette,
  Moon,
  Monitor,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const themes = [
  {
    title: "Dark Mode",
    description:
      "Premium futuristic dark dashboard experience.",
    icon: Moon,
    active: true,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "System Theme",
    description:
      "Automatically match your system appearance.",
    icon: Monitor,
    active: false,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const AppearanceSettings = () => {
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
              <Palette
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Appearance Settings
              </h2>

              <p className="text-sm text-gray-400">
                Customize dashboard appearance & theme
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            UI Personalization
          </div>
        </div>

        {/* Theme Cards */}
        <div className="space-y-5 mb-8">
          
          {themes.map((theme, index) => {
            const Icon = theme.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className={`
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-5
                  rounded-3xl
                  border
                  ${theme.border}
                  ${theme.bg}
                  p-5
                `}
              >
                {/* Left */}
                <div className="flex items-start gap-4">
                  
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      ${theme.bg}
                    `}
                  >
                    <Icon
                      className={theme.color}
                      size={24}
                    />
                  </div>

                  <div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {theme.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <div
                  className={`
                    w-14
                    h-8
                    rounded-full
                    flex
                    items-center
                    px-1
                    transition-all
                    duration-300
                    ${
                      theme.active
                        ? "bg-cyan-500"
                        : "bg-white/10"
                    }
                  `}
                >
                  <div
                    className={`
                      w-6
                      h-6
                      rounded-full
                      bg-white
                      transition-all
                      duration-300
                      ${
                        theme.active
                          ? "ml-auto"
                          : "ml-0"
                      }
                    `}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dashboard Density */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
          
          <div className="flex items-center gap-4 mb-6">
            
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <LayoutDashboard
                className="text-purple-400"
                size={22}
              />
            </div>

            <div>
              
              <h3 className="text-lg font-semibold text-white">
                Dashboard Density
              </h3>

              <p className="text-sm text-gray-400">
                Control dashboard spacing & layout feel
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {["Compact", "Comfortable", "Expanded"].map(
              (option, index) => (
                <button
                  key={index}
                  className={`
                    py-4
                    rounded-2xl
                    border
                    transition-all
                    duration-300
                    ${
                      option === "Comfortable"
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : "bg-black/20 border-white/10 text-gray-300 hover:border-cyan-500/20"
                    }
                  `}
                >
                  {option}
                </button>
              )
            )}
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Appearance Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Personalize your InterviewVerse AI dashboard
            experience with futuristic themes, optimized
            layout density, and premium UI customization
            preferences for better productivity.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;