// src/components/settings/InterviewPreferences.jsx

import { motion } from "framer-motion";

import {
  Brain,
  Languages,
  Timer,
  Mic,
  Sparkles,
} from "lucide-react";

const InterviewPreferences = () => {
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
              <Brain
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Interview Preferences
              </h2>

              <p className="text-sm text-gray-400">
                Customize AI interview experience
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            AI Personalization
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Preferred Language */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Preferred Language
            </label>

            <div className="relative">
              
              <Languages
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <select
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              >
                <option>English</option>
                <option>Hindi</option>
                <option>English + Hindi</option>
              </select>
            </div>
          </div>

          {/* Interview Duration */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Interview Duration
            </label>

            <div className="relative">
              
              <Timer
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <select
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option selected>
                  45 Minutes
                </option>
                <option>60 Minutes</option>
              </select>
            </div>
          </div>

          {/* AI Voice */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              AI Interview Voice
            </label>

            <div className="relative">
              
              <Mic
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <select
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              >
                <option>Professional Male</option>
                <option>Professional Female</option>
                <option selected>
                  Neutral AI Voice
                </option>
              </select>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Default Difficulty
            </label>

            <div className="relative">
              
              <Brain
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <select
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              >
                <option>Easy</option>
                <option selected>
                  Medium
                </option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-5 mt-8">
          
          {/* Camera */}
          <div className="flex items-center justify-between bg-[#111827] border border-white/10 rounded-3xl p-5">
            
            <div>
              
              <h3 className="text-lg font-semibold text-white mb-1">
                Camera Access
              </h3>

              <p className="text-sm text-gray-400">
                Enable camera during interviews
              </p>
            </div>

            <div className="w-14 h-8 rounded-full bg-cyan-500 flex items-center px-1">
              <div className="w-6 h-6 rounded-full bg-white ml-auto"></div>
            </div>
          </div>

          {/* Microphone */}
          <div className="flex items-center justify-between bg-[#111827] border border-white/10 rounded-3xl p-5">
            
            <div>
              
              <h3 className="text-lg font-semibold text-white mb-1">
                Microphone Access
              </h3>

              <p className="text-sm text-gray-400">
                Enable voice interaction with AI interviewer
              </p>
            </div>

            <div className="w-14 h-8 rounded-full bg-cyan-500 flex items-center px-1">
              <div className="w-6 h-6 rounded-full bg-white ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          
          <button
            className="
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
            Save Preferences
          </button>
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Interview Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Personalize your interview environment with
            preferred language, AI voice style, interview
            duration, and smart difficulty settings for a
            more realistic interview preparation experience.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewPreferences;